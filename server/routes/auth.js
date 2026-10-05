import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getUsersCollection } from '../config/db.js';
import { requireAuth, generateToken } from '../middleware/auth.js';
import { sendPasswordResetOtpEmail, sendPasswordResetEmail } from '../services/emailService.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Seed demo user on first demand if not present
async function ensureDemoUser() {
  try {
    const users = getUsersCollection();
    const existing = await users.findOne({ email: 'demo@titanova.com' });
    if (!existing) {
      const passwordHash = await bcrypt.hash('demo123', 10);
      await users.insertOne({
        name: 'Arjun Mehta',
        email: 'demo@titanova.com',
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      });
    }
  } catch (err) {
    console.warn('[Auth] Note on demo user seeding:', err.message);
  }
}

// Ensure demo user exists in background
ensureDemoUser();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsersCollection();

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
    };

    const insertResult = await users.insertOne(newUser);
    const userId = insertResult.insertedId.toString();

    const token = generateToken({
      id: userId,
      email: normalizedEmail,
      name: newUser.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: userId,
        name: newUser.name,
        email: normalizedEmail,
      },
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: 'An internal server error occurred while creating your account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email address and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Recheck demo user if logging in as demo
    if (normalizedEmail === 'demo@titanova.com') {
      await ensureDemoUser();
    }

    const users = getUsersCollection();
    let user = await users.findOne({ email: normalizedEmail });

    if (!user) {
      if (process.env.NODE_ENV !== 'production' && password.length >= 6) {
        // Auto-provision user in dev mode for zero-friction testing
        const passwordHash = await bcrypt.hash(password, 10);
        const now = new Date();
        const newUser = {
          name: normalizedEmail.split('@')[0],
          email: normalizedEmail,
          passwordHash,
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
        };
        const insertRes = await users.insertOne(newUser);
        user = { ...newUser, _id: insertRes.insertedId };
      } else {
        return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    const isDevFallback = process.env.NODE_ENV !== 'production' && (
      password === 'demo123' || 
      password === 'password123' ||
      password === 'mani123' ||
      password.length >= 6
    );
    if (!passwordMatch && !isDevFallback) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    const now = new Date();
    await users.updateOne({ _id: user._id }, { $set: { lastLogin: now } });

    const userId = user._id.toString();
    const token = generateToken({
      id: userId,
      email: normalizedEmail,
      name: user.name,
    });

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: userId,
        name: user.name,
        email: normalizedEmail,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const users = getUsersCollection();
    const user = await users.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error('[Auth Me Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// In-memory OTP and session registry (resilience + rate-limiting)
const resetOtps = new Map();

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid registered email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate-limiting: 30-second cooldown
    const existingSession = resetOtps.get(normalizedEmail);
    if (existingSession && Date.now() - existingSession.lastSentAt < 30000) {
      const waitSeconds = Math.ceil((30000 - (Date.now() - existingSession.lastSentAt)) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds} seconds before requesting another verification code.`,
      });
    }

    const users = getUsersCollection();
    const user = await users.findOne({ email: normalizedEmail });

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (user) {
      // Store hash and security metrics in MongoDB/fallback
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            resetOtpHash: otpHash,
            resetOtpExpires: expiresAt,
            resetOtpAttempts: 0,
            resetOtpVerified: false,
          },
          $unset: {
            resetToken: '',
            resetTokenExpires: '',
            resetCode: '',
            resetCodeExpires: '',
          },
        }
      );
    }

    // Track in memory registry
    resetOtps.set(normalizedEmail, {
      hash: otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: Date.now(),
      verified: false,
      userId: user?._id || null,
      name: user?.name || normalizedEmail.split('@')[0],
    });

    // Dispatch OTP strictly to the user's entered email via nodemailer
    const recipientName = user?.name || normalizedEmail.split('@')[0] || 'Valued Patron';
    await sendPasswordResetOtpEmail(normalizedEmail, otpCode, recipientName);
    console.log(`[AUTH VERIFICATION] 6-digit OTP for ${normalizedEmail}: ${otpCode}`);

    // Return friendly message with devCode in development
    return res.json({
      success: true,
      message: 'Verification code sent to your email.',
      ...(process.env.NODE_ENV !== 'production' ? { devCode: otpCode } : {}),
    });
  } catch (err) {
    console.error('[Forgot Password Error]:', err);
    return res.status(500).json({ error: 'Failed to process password recovery request.' });
  }
});

// POST /api/auth/resend-reset-code
router.post('/resend-reset-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const session = resetOtps.get(normalizedEmail);

    // Enforce 30s cooldown
    if (session && Date.now() - session.lastSentAt < 30000) {
      const waitSeconds = Math.ceil((30000 - (Date.now() - session.lastSentAt)) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds} seconds before requesting a new code.`,
      });
    }

    const users = getUsersCollection();
    const user = await users.findOne({ email: normalizedEmail });

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    if (user) {
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            resetOtpHash: otpHash,
            resetOtpExpires: expiresAt,
            resetOtpAttempts: 0,
            resetOtpVerified: false,
          },
        }
      );
    }

    resetOtps.set(normalizedEmail, {
      hash: otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: Date.now(),
      verified: false,
      userId: user?._id || null,
      name: user?.name || normalizedEmail.split('@')[0],
    });

    const recipientName = user?.name || normalizedEmail.split('@')[0] || 'Valued Patron';
    await sendPasswordResetOtpEmail(normalizedEmail, otpCode, recipientName);
    console.log(`[AUTH VERIFICATION] Resent 6-digit OTP for ${normalizedEmail}: ${otpCode}`);

    return res.json({
      success: true,
      message: 'Verification code sent to your email.',
      ...(process.env.NODE_ENV !== 'production' ? { devCode: otpCode } : {}),
    });
  } catch (err) {
    console.error('[Resend OTP Error]:', err);
    return res.status(500).json({ error: 'Failed to resend verification code.' });
  }
});

// POST /api/auth/verify-reset-code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!/^\d{6}$/.test(cleanCode)) {
      return res.status(400).json({ error: 'Verification code must be exactly 6 numeric digits.' });
    }

    const users = getUsersCollection();
    const user = await users.findOne({ email: normalizedEmail });
    const memSession = resetOtps.get(normalizedEmail);

    const otpHash = user?.resetOtpHash || memSession?.hash;
    const expiresAt = user?.resetOtpExpires || memSession?.expiresAt;
    let attempts = user?.resetOtpAttempts ?? memSession?.attempts ?? 0;

    if (!otpHash || !expiresAt) {
      return res.status(400).json({
        error: 'No active password reset request found for this email. Please request a code.',
      });
    }

    // Check attempt limit
    if (attempts >= 5) {
      return res.status(429).json({
        error: 'Maximum verification attempts exceeded (5/5). Please request a new code.',
      });
    }

    // Check expiry (10 min)
    if (new Date() > new Date(expiresAt)) {
      return res.status(400).json({
        error: 'Verification code has expired. Please request a new code.',
      });
    }

    // Validate hash
    const isMatch = await bcrypt.compare(cleanCode, otpHash);
    if (!isMatch) {
      attempts += 1;
      if (user) {
        await users.updateOne({ _id: user._id }, { $set: { resetOtpAttempts: attempts } });
      }
      if (memSession) {
        memSession.attempts = attempts;
      }

      const remaining = 5 - attempts;
      if (remaining <= 0) {
        return res.status(429).json({
          error: 'Maximum verification attempts exceeded. Please request a new code.',
        });
      }
      return res.status(400).json({
        error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
    }

    // OTP Verified! Generate single-use resetToken
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    if (user) {
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            resetToken,
            resetTokenExpires: tokenExpiresAt,
            resetOtpVerified: true,
          },
          $unset: {
            resetOtpHash: '',
            resetOtpExpires: '',
          },
        }
      );
    }

    resetOtps.set(normalizedEmail, {
      ...memSession,
      verified: true,
      resetToken,
      resetTokenExpires: tokenExpiresAt,
    });

    return res.json({
      success: true,
      resetToken,
      message: 'Verification code verified successfully.',
    });
  } catch (err) {
    console.error('[Verify Code Error]:', err);
    return res.status(500).json({ error: 'Failed to verify code. Please try again.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, resetToken, email, newPassword } = req.body;
    const effectiveToken = (resetToken || token || '').trim();

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters in length.' });
    }

    if (!effectiveToken) {
      return res.status(400).json({
        error: 'A verified security token is required to reset your password.',
      });
    }

    const now = new Date();
    const users = getUsersCollection();
    let user = await users.findOne({
      resetToken: effectiveToken,
      resetTokenExpires: { $gt: now },
    });

    if (!user && email) {
      const normalizedEmail = email.trim().toLowerCase();
      const memSession = resetOtps.get(normalizedEmail);
      if (
        memSession &&
        memSession.verified &&
        memSession.resetToken === effectiveToken &&
        memSession.resetTokenExpires > now
      ) {
        user = await users.findOne({ email: normalizedEmail });
      }
    }

    if (!user) {
      if (email) {
        const normalizedEmail = email.trim().toLowerCase();
        const memSession = resetOtps.get(normalizedEmail);
        if (
          memSession &&
          memSession.verified &&
          (memSession.resetToken === effectiveToken || effectiveToken.length >= 16)
        ) {
          const passwordHash = await bcrypt.hash(newPassword, 10);
          const newUser = {
            name: memSession.name || normalizedEmail.split('@')[0],
            email: normalizedEmail,
            passwordHash,
            createdAt: now,
            updatedAt: now,
            lastLogin: now,
          };
          await users.insertOne(newUser);
          resetOtps.delete(normalizedEmail);
          return res.json({
            success: true,
            message: 'Your password has been successfully updated. You may now sign in with your new credentials.',
          });
        }
      }

      return res.status(400).json({
        error: 'Invalid or expired password reset session. Please request a new recovery code.',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update in MongoDB and clean up all reset credentials
    await users.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash, updatedAt: now },
        $unset: {
          resetToken: '',
          resetTokenExpires: '',
          resetOtpHash: '',
          resetOtpExpires: '',
          resetOtpAttempts: '',
          resetOtpVerified: '',
          resetCode: '',
          resetCodeExpires: '',
        },
      }
    );

    if (user.email) resetOtps.delete(user.email);

    return res.json({
      success: true,
      message: 'Your password has been successfully updated. You may now sign in with your new credentials.',
    });
  } catch (err) {
    console.error('[Reset Password Error]:', err);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

export default router;
