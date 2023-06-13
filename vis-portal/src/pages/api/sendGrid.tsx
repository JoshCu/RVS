import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) {
      throw new Error('Missing SENDGRID_API_KEY environment variable');
  }
  sgMail.setApiKey(SENDGRID_API_KEY);
  const sendTo = req.body.sendTo;
  const verificationToken = req.body.verificationToken;

  if (!sendTo) {
    res.status(400).json({ error: 'Email address required' });
    return;
  }

  const message = {
    to: sendTo,
    from: 'visportal61@gmail.com',
    subject: 'Creator Token Request',
    html: `
    <html>
      <head>
        <title>VisPortal</title>
      </head>
      <body style="text-align: center; font-family: Arial, sans-serif;">
        <h1>Welcome to VisPortal!</h1>
        <p>Click the link below to verify your email.</p>
        <p>This link will expire in 10 minutes.</p>
        <a href="http://localhost:3000/creators/${verificationToken}"
          style="display: inline-block; padding: 10px 20px;">
          Verify Your Email
        </a>
      </body>
    </html>`
};


  try {
    await sgMail.send(message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
}
