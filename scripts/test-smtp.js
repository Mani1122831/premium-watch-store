import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

async function testEmailAuth() {
  console.log('Testing SMTP with:', process.env.MAIL_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP AUTH SUCCESS: Connection and credentials are valid!');
  } catch (err) {
    console.error('SMTP AUTH FAILED:', err.message);
    if (err.response) console.error('SMTP Response:', err.response);
  }
}

testEmailAuth();
