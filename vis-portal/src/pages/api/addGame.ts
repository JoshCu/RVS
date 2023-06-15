import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import authenticationHandler from '../authentication/authenticationHandler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const creator = await authenticationHandler(req, res);
    if (!creator) {
      res.status(403).json({ message: "Access denied"} );
      return;
    }
    res.status(200).json({ creator: creator });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while processing your request."});
  }
}
