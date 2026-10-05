import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTIFICATIONS_FILE = path.join(__dirname, '../data/admin_notifications.json');

/**
 * Format currency in Indian Rupees
 */
function formatCurrency(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/**
 * Build professional TITANOVA luxury HTML order notification email
 */
function buildOrderHtml(order) {
  const itemsHtml = (order.items || [])
    .map(
      item => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2a2a2a; text-align: left;">
          <div style="font-weight: 600; color: #ffffff; font-size: 14px;">${item.productName}</div>
          <div style="font-size: 11px; color: #a0a0a0; margin-top: 4px;">ID: ${item.productId}</div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2a2a2a; text-align: center; color: #d4d4d4; font-size: 13px;">
          ${item.quantity}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2a2a2a; text-align: right; color: #d4d4d4; font-size: 13px;">
          ${formatCurrency(item.price)}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2a2a2a; text-align: right; color: #d4a017; font-weight: 600; font-size: 13px;">
          ${formatCurrency(item.subtotal)}
        </td>
      </tr>
    `
    )
    .join('');

  const shipping = order.shippingAddress || {};

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TITANOVA – New Order #${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0d10; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #14151a; border: 1px solid #2e281b; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0c0d10; padding: 32px 30px; text-align: center; border-bottom: 1px solid #2e281b;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                TITANOVA
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.3em; color: #d4a017; text-transform: uppercase;">
                HAUTE HORLOGERIE • ORDER NOTIFICATION
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding: 28px 30px 16px 30px; text-align: center;">
              <span style="display: inline-block; background-color: #211c12; color: #e2b83d; border: 1px solid #d4a017; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; padding: 6px 16px; border-radius: 20px;">
                NEW ORDER RECEIVED
              </span>
              <h2 style="margin: 16px 0 4px 0; font-family: 'Georgia', serif; font-size: 22px; color: #ffffff;">
                Order #${order.orderId}
              </h2>
              <p style="margin: 0; font-size: 12px; color: #888888;">
                Placed on ${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </td>
          </tr>

          <!-- Customer & Shipping Summary Grid -->
          <tr>
            <td style="padding: 10px 30px 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" valign="top" style="padding: 16px; background-color: #1a1c22; border: 1px solid #262830; border-radius: 6px;">
                    <div style="font-size: 10px; font-weight: bold; letter-spacing: 0.15em; color: #d4a017; text-transform: uppercase; margin-bottom: 8px;">
                      CUSTOMER DETAILS
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${order.customerName || 'N/A'}</div>
                    <div style="font-size: 12px; color: #aaaaaa; margin-top: 4px;">${order.customerEmail || 'N/A'}</div>
                    <div style="font-size: 12px; color: #aaaaaa; margin-top: 2px;">Phone: ${order.phone || shipping.phone || 'N/A'}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="46%" valign="top" style="padding: 16px; background-color: #1a1c22; border: 1px solid #262830; border-radius: 6px;">
                    <div style="font-size: 10px; font-weight: bold; letter-spacing: 0.15em; color: #d4a017; text-transform: uppercase; margin-bottom: 8px;">
                      DELIVERY ADDRESS
                    </div>
                    <div style="font-size: 12px; color: #dddddd; line-height: 1.5;">
                      ${shipping.street || ''}<br>
                      ${shipping.city ? shipping.city + ', ' : ''}${shipping.state || ''} ${shipping.pincode || ''}<br>
                      ${shipping.country || 'India'}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #111216; border-bottom: 2px solid #d4a017;">
                    <th style="padding: 12px; text-align: left; font-size: 11px; letter-spacing: 0.15em; color: #a0a0a0; text-transform: uppercase;">Item</th>
                    <th style="padding: 12px; text-align: center; font-size: 11px; letter-spacing: 0.15em; color: #a0a0a0; text-transform: uppercase;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 11px; letter-spacing: 0.15em; color: #a0a0a0; text-transform: uppercase;">Unit Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 11px; letter-spacing: 0.15em; color: #a0a0a0; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown -->
          <tr>
            <td style="padding: 0 30px 28px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="55%"></td>
                  <td width="45%">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 6px 0; color: #999999;">Subtotal:</td>
                        <td style="padding: 6px 0; text-align: right; color: #ffffff;">${formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #999999;">Insured Shipping:</td>
                        <td style="padding: 6px 0; text-align: right; color: ${order.shipping === 0 ? '#4ade80' : '#ffffff'};">
                          ${order.shipping === 0 ? 'Complimentary' : formatCurrency(order.shipping)}
                        </td>
                      </tr>
                      ${order.discount ? `
                      <tr>
                        <td style="padding: 6px 0; color: #4ade80;">Bespoke Privilege:</td>
                        <td style="padding: 6px 0; text-align: right; color: #4ade80;">-${formatCurrency(order.discount)}</td>
                      </tr>` : ''}
                      <tr style="border-top: 1px solid #333333;">
                        <td style="padding: 12px 0; font-size: 15px; font-weight: bold; color: #ffffff;">Grand Total:</td>
                        <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #d4a017; text-align: right;">
                          ${formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Status Bar -->
          <tr>
            <td style="padding: 16px 30px; background-color: #1a1c22; border-top: 1px solid #2e281b; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                Order Status: <strong style="color: #4ade80; text-transform: uppercase;">${order.orderStatus || 'Confirmed'}</strong> &nbsp;|&nbsp; 
                Payment: <strong style="color: #ffffff; text-transform: uppercase;">${order.paymentMethod || 'Online'}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background-color: #0c0d10; font-size: 11px; color: #666666;">
              <p style="margin: 0;">This is an automated administrative dispatch from the TITANOVA Horology Master Atelier.</p>
              <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} TITANOVA. Time, Refined.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
// Persist admin notification to local JSON storage
function persistAdminNotification(order, emailResult) {
  try {
    const dir = path.dirname(NOTIFICATIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existing = [];
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
      } catch {
        existing = [];
      }
    }

    const notificationRecord = {
      id: 'notif_' + Date.now(),
      orderId: order.orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone || order.shippingAddress?.phone,
      totalAmount: order.totalAmount,
      items: order.items?.map(i => ({ name: i.productName, qty: i.quantity, price: i.price })),
      shippingAddress: order.shippingAddress,
      emailStatus: emailResult,
      createdAt: new Date().toISOString(),
    };

    existing.unshift(notificationRecord);
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(existing.slice(0, 100), null, 2));
    console.log(`[Email Service] Notification recorded in admin messages archive for #${order.orderId}`);
  } catch (err) {
    console.warn('[Email Service] Note saving local notification:', err.message);
  }
}

/**
 * Send Order Notification Email to ADMIN_EMAIL via Gmail SMTP (nodemailer)
 */
export async function sendOrderNotificationEmail(order) {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || mailUser;

  if (!mailUser || !mailPass || !adminEmail) {
    console.log(
      `[Email Service] Order #${order.orderId} recorded in MongoDB. Configure MAIL_USER and MAIL_PASSWORD to activate instant Gmail dispatches.`
    );
    const result = {
      sent: false,
      reason: 'credentials_not_configured',
      recipient: adminEmail || null,
    };
    persistAdminNotification(order, result);
    return result;
  }

  // Attempt 1: Configured settings (Default: port 465 SSL)
  const isSecure = process.env.MAIL_SECURE === 'true' || (process.env.MAIL_PORT || '465') === '465';
  const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
  const mailPort = parseInt(process.env.MAIL_PORT || (isSecure ? '465' : '587'), 10);

  const mailOptions = {
    from: `"TITANOVA Horology Atelier" <${mailUser}>`,
    to: adminEmail,
    subject: `TITANOVA – New Order #${order.orderId}`,
    html: buildOrderHtml(order),
    text: `TITANOVA - New Order #${order.orderId}\n\nCustomer: ${order.customerName} (${order.customerEmail})\nTotal: ${formatCurrency(order.totalAmount)}\nDate: ${new Date(order.createdAt).toISOString()}`,
  };

  try {
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: isSecure,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Order notification email successfully dispatched for #${order.orderId}. MessageId: ${info.messageId}`);
    const result = {
      sent: true,
      messageId: info.messageId,
      recipient: adminEmail,
    };
    persistAdminNotification(order, result);
    return result;
  } catch (err) {
    console.warn(`[Email Service Notice] Port ${mailPort} failed (${err.message}). Trying fallback port 587 (TLS)...`);

    // Attempt 2: Fallback to Port 587 (STARTTLS)
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: mailHost,
        port: 587,
        secure: false,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });

      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[Email Service] Order email dispatched via fallback port 587 for #${order.orderId}. MessageId: ${fallbackInfo.messageId}`);
      const result = {
        sent: true,
        messageId: fallbackInfo.messageId,
        recipient: adminEmail,
      };
      persistAdminNotification(order, result);
      return result;
    } catch (fallbackErr) {
      console.warn(`[Email Service Notice] Gmail SMTP notification could not be delivered: ${fallbackErr.message}`);
      const result = {
        sent: false,
        error: fallbackErr.message,
        recipient: adminEmail,
      };
      persistAdminNotification(order, result);
      return result;
    }
  }
}

/**
 * Build professional TITANOVA luxury HTML password reset email
 */
function buildPasswordResetHtml(patronName, resetUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TITANOVA – Password Recovery Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0d10; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #14151a; border: 1px solid #2e281b; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0c0d10; padding: 32px 30px; text-align: center; border-bottom: 1px solid #2e281b;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                TITANOVA
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.3em; color: #d4a017; text-transform: uppercase;">
                HAUTE HORLOGERIE • PATRON SECURITY
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding: 32px 36px 16px 36px; text-align: center;">
              <span style="display: inline-block; background-color: #211c12; color: #e2b83d; border: 1px solid #d4a017; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; padding: 6px 16px; border-radius: 20px;">
                SECURITY CONCIERGE
              </span>
              <h2 style="margin: 18px 0 8px 0; font-family: 'Georgia', serif; font-size: 24px; color: #ffffff;">
                Password Reset Request
              </h2>
              <p style="margin: 0; font-size: 13px; color: #a3a3a3; line-height: 1.6;">
                Dear ${patronName || 'Valued Patron'},<br>
                A request has been received to reset the authentication password associated with your TITANOVA patron account.
              </p>
            </td>
          </tr>

          <!-- Action Button Section -->
          <tr>
            <td style="padding: 24px 36px; text-align: center;">
              <div style="background-color: #1a1c22; border: 1px solid #282a32; border-radius: 8px; padding: 28px 20px;">
                <p style="margin: 0 0 20px 0; font-size: 13px; color: #cccccc;">
                  Click the button below to establish a new password for your account:
                </p>
                <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #d4a017; color: #0c0d10; font-weight: bold; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 4px; box-shadow: 0 4px 15px rgba(212,160,23,0.3);">
                  Reset Your Password
                </a>
                <p style="margin: 20px 0 0 0; font-size: 11px; color: #888888;">
                  This link is cryptographically secured and expires in <strong>60 minutes</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Fallback URL -->
          <tr>
            <td style="padding: 0 36px 24px 36px;">
              <p style="margin: 0; font-size: 11px; color: #777777; line-height: 1.5; word-break: break-all;">
                If the button above does not render in your email client, paste this secure URL directly into your browser:<br>
                <a href="${resetUrl}" style="color: #d4a017; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 16px 36px 28px 36px; border-top: 1px solid #23252c; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #777777; line-height: 1.5;">
                If you did not initiate this request, no action is needed; your password remains unchanged. For immediate concerns, contact the TITANOVA security concierge.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background-color: #0c0d10; font-size: 11px; color: #666666; border-top: 1px solid #2e281b;">
              <p style="margin: 0;">TITANOVA Haute Horlogerie • Private Atelier Services</p>
              <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} TITANOVA. Time, Refined.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send Password Reset Email via Gmail SMTP (nodemailer)
 */
export async function sendPasswordResetEmail(toEmail, resetUrl, patronName) {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASSWORD;

  const mailOptions = {
    from: `"TITANOVA Security Concierge" <${mailUser || 'concierge@titanova.com'}>`,
    to: toEmail,
    subject: `TITANOVA – Password Recovery Request`,
    html: buildPasswordResetHtml(patronName, resetUrl),
    text: `Dear ${patronName || 'Valued Patron'},\n\nA password reset request was received for your TITANOVA account.\n\nPlease reset your password using the following link:\n${resetUrl}\n\nThis link expires in 60 minutes.\n\nTITANOVA Haute Horlogerie`,
  };

  if (!mailUser || !mailPass) {
    console.log(
      `[Email Service] Password reset requested for ${toEmail}. Link: ${resetUrl}`
    );
    return {
      sent: false,
      reason: 'credentials_not_configured',
      resetUrl,
      recipient: toEmail,
    };
  }

  const isSecure = process.env.MAIL_SECURE === 'true' || (process.env.MAIL_PORT || '465') === '465';
  const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
  const mailPort = parseInt(process.env.MAIL_PORT || (isSecure ? '465' : '587'), 10);

  try {
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: isSecure,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: { user: mailUser, pass: mailPass },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Password reset email dispatched to ${toEmail}. MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, recipient: toEmail };
  } catch (err) {
    console.warn(`[Email Service Notice] Port ${mailPort} failed for reset email. Trying port 587...`);
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: mailHost,
        port: 587,
        secure: false,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        auth: { user: mailUser, pass: mailPass },
      });
      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[Email Service] Password reset email dispatched via fallback port 587 to ${toEmail}. MessageId: ${fallbackInfo.messageId}`);
      return { sent: true, messageId: fallbackInfo.messageId, recipient: toEmail };
    } catch (fallbackErr) {
      console.warn(`[Email Service Notice] Gmail reset email could not be delivered: ${fallbackErr.message}`);
      return { sent: false, error: fallbackErr.message, resetUrl, recipient: toEmail };
    }
  }
}

/**
 * Build professional TITANOVA luxury HTML password reset OTP email
 */
function buildPasswordResetOtpHtml(patronName, otpCode) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TITANOVA – Password Reset Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0d10; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #14151a; border: 1px solid #2e281b; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0c0d10; padding: 32px 30px; text-align: center; border-bottom: 1px solid #2e281b;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                TITANOVA
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.3em; color: #d4a017; text-transform: uppercase;">
                HAUTE HORLOGERIE • PATRON SECURITY
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding: 32px 36px 16px 36px; text-align: center;">
              <span style="display: inline-block; background-color: #211c12; color: #e2b83d; border: 1px solid #d4a017; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; padding: 6px 16px; border-radius: 20px;">
                SECURITY CONCIERGE • VERIFICATION CODE
              </span>
              <h2 style="margin: 18px 0 8px 0; font-family: 'Georgia', serif; font-size: 24px; color: #ffffff;">
                Password Reset Verification
              </h2>
              <p style="margin: 0; font-size: 13px; color: #a3a3a3; line-height: 1.6;">
                Dear ${patronName || 'Valued Patron'},<br>
                A request has been initiated to verify your identity and reset your TITANOVA account password. Please enter the following 6-digit verification code:
              </p>
            </td>
          </tr>

          <!-- OTP Code Box -->
          <tr>
            <td style="padding: 20px 36px; text-align: center;">
              <div style="background-color: #1a1c22; border: 2px solid #d4a017; border-radius: 8px; padding: 24px 20px; box-shadow: 0 4px 25px rgba(212,160,23,0.15);">
                <div style="font-size: 11px; font-weight: bold; letter-spacing: 0.25em; color: #888888; text-transform: uppercase; margin-bottom: 10px;">
                  YOUR 6-DIGIT VERIFICATION CODE
                </div>
                <div style="font-family: 'Courier New', Courier, monospace, 'Georgia', serif; font-size: 38px; font-weight: bold; letter-spacing: 0.35em; color: #d4a017; text-indent: 0.35em; padding: 8px 0;">
                  ${otpCode}
                </div>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #cccccc;">
                  This code expires in <strong style="color: #ffffff;">10 minutes</strong>. (Maximum 5 attempts allowed)
                </p>
              </div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 16px 36px 28px 36px; border-top: 1px solid #23252c; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888; line-height: 1.6;">
                If you did not initiate this password recovery request, please disregard this email. Never disclose this verification code to anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background-color: #0c0d10; font-size: 11px; color: #666666; border-top: 1px solid #2e281b;">
              <p style="margin: 0;">TITANOVA Haute Horlogerie • Private Atelier Services</p>
              <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} TITANOVA. Time, Refined.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send Password Reset OTP Email via Gmail SMTP (nodemailer)
 * Sends strictly to the patron's email address
 */
export async function sendPasswordResetOtpEmail(toEmail, otpCode, patronName) {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASSWORD;

  const mailOptions = {
    from: `"TITANOVA Security Concierge" <${mailUser || 'concierge@titanova.com'}>`,
    to: toEmail,
    subject: `TITANOVA – Password Reset Verification Code`,
    html: buildPasswordResetOtpHtml(patronName, otpCode),
    text: `Dear ${patronName || 'Valued Patron'},\n\nYour TITANOVA password reset verification code is:\n\n${otpCode}\n\nThis code expires in 10 minutes.\n\nTITANOVA Haute Horlogerie`,
  };

  if (!mailUser || !mailPass) {
    console.log(
      `[Email Service] Password reset OTP generated for ${toEmail}.`
    );
    return {
      sent: false,
      reason: 'credentials_not_configured',
      recipient: toEmail,
    };
  }

  const isSecure = process.env.MAIL_SECURE === 'true' || (process.env.MAIL_PORT || '465') === '465';
  const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
  const mailPort = parseInt(process.env.MAIL_PORT || (isSecure ? '465' : '587'), 10);

  try {
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: isSecure,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: { user: mailUser, pass: mailPass },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Verification OTP email dispatched to ${toEmail}. MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, recipient: toEmail };
  } catch (err) {
    console.warn(`[Email Service Notice] Port ${mailPort} failed for OTP email. Trying fallback port 587...`);
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: mailHost,
        port: 587,
        secure: false,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        auth: { user: mailUser, pass: mailPass },
      });
      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[Email Service] Verification OTP email dispatched via fallback port 587 to ${toEmail}. MessageId: ${fallbackInfo.messageId}`);
      return { sent: true, messageId: fallbackInfo.messageId, recipient: toEmail };
    } catch (fallbackErr) {
      console.warn(`[Email Service Notice] Gmail reset OTP email could not be delivered: ${fallbackErr.message}`);
      return { sent: false, error: fallbackErr.message, recipient: toEmail };
    }
  }
}


