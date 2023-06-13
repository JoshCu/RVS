import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.body.token;
  const client = await clientPromise;
  const db = client.db("games_and_scores");

  const creator = await db
    .collection("creators")
    .findOne({ _id: new ObjectId(token) });
  
  if (!creator) {
    res.status(403).json({ message: "Invalid or expired token" });
  } else if (creator.verified == true) {
    res.status(403).json({ message:"Verification code has already been used. Please generate a new one" });
  }

  const apiKey = crypto.randomBytes(32).toString('hex');
  const bcrypt = require('bcrypt');
  const hashedApiKey = await bcrypt.hash(apiKey, 10);

  const updatedCreator = await db
    .collection("creators")
    .updateOne(
      { _id: new ObjectId(token) },
      { 
        $set: { verified: true, apiKey: hashedApiKey },
        $unset: { verificationExpires: "" },
      },
      { upsert: false}
    );
  
    if (updatedCreator.modifiedCount == 0) {
      res.status(500).json({ message: "An error occurred while verifying your account" });
      return;
    }

    res.status(200).json({ apiKey: apiKey });
}
