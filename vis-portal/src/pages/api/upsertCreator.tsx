import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';

export type Creator = {
  _id: string,
  email: string,
  verified: boolean,
  verificationExpires: Date
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({ message: "No email provided" });
      return;
    }
    const emailRegex = /^[a-zA-Z]{2,3}\d+@uakron\.edu$/;
    if (!emailRegex.test(email)) {
      res.status(403).json({ message: "Invalid request" });
      return;
    }
    
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const result = await db
      .collection("creators")
      .findOneAndUpdate(
        {
          email: email
        },
        {
          // always set verified to false as the user is in the process of re-verifying for their key
          $set: {
            verified: false,
            verificationExpires: new Date(new Date().getTime() + 10 * 60000 )
          },
          // creatorKey and keyExpiry are unset as any re-verifying user should not have these fields until the process is complete
          $unset: {
            creatorKey: "",
            keyExpiry: ""
          }
        },
        {
          upsert: true
        }
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
