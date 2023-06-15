import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';

export default async function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.headers['email'];
    if (!email) {
        res.status(403).json({ message: "Email was not provided" });
        return false;
    }

    const creatorKey = req.headers['creator_key'];
    if (!creatorKey) {
        res.status(403).json({ message: "Creator key was not provided" });
        return false;
    }

    const client = await clientPromise;
    const db = client.db("games_and_scores");
    const creator = await db
      .collection("creators")
      .findOne({ "email": email });
    
    if (!creator) {
        res.status(403).json({ message: "Access denied" });
        return false;
    }

    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(creatorKey, creator.creator_key);
    const currentDate = new Date();
    const isExpired = currentDate > creator.key_expiry;

    if (!isMatch || isExpired) {
        res.status(403).json({ message: "Invalid or expired creator key" });
        return false;
    }

    return creator;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while processing your request."});
    return false;
  }
};
