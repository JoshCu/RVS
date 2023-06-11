import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';

export type Game = {
  _id: string,
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[]>
) {
  try {
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const games = await db
      .collection("games")
      .find({}, { projection: { _id: 1, name: 1} })
      .toArray();
    
    const gamesWithIdAsString = games.map(game => ({
      _id: game._id.toString(),
      name: game.name
    }));
    
    res.status(200).json(gamesWithIdAsString);
  } catch (e) {
    console.error(e);
  }
}
