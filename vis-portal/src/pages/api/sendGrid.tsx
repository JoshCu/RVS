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
    subject: 'API Token Request',
    html: `<a href="http://localhost:3000/verify?token=${verificationToken}">Click here to verify your email</a>`
  };

  try {
    await sgMail.send(message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
}
