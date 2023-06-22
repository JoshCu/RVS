import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import clientPromise from '../../../lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

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
  if (!sendTo) {
    res.status(400).json({ message: "No email provided" });
    return;
  }
  const emailRegex = /^[a-zA-Z]{2,3}\d+@uakron\.edu$/;
  if (!emailRegex.test(sendTo)) {
    res.status(403).json({ message: "Invalid request" });
    return;
  }

  const verificationToken = req.body.verificationToken;
  if (!verificationToken) {
    res.status(403).json({ error: 'Invalid request' });
    return;
  }

  const client = await clientPromise;
  const db = client.db("games_and_scores");
  const creator = await db
    .collection("creators")
    .findOne({ _id: new ObjectId(verificationToken) });
  
  if (!creator) {
    res.status(403).json({ error: "Request blocked"});
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
        <p>Click the link below to verify your email and claim your creator key.</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not make this request, please feel free to ignore this email.</p>
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
