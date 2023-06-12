import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';

export type Creator = {
  _id: string,
  email: string,
  verified: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.body.email;
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const result = await db
      .collection("creators")
      .findOneAndUpdate(
        { email: email },
        // always set verified to false as the user is in the process of re-verifying for their key
        { $set: { verified: false } },
        { upsert: true }
      );
    
      if (result.value) {
        res.status(200).json({ _id: result.value._id.toString() });
      } else {
        throw new Error('Unable to perform upsert operation');
      }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while processing your request."});
  }
}
