import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';

export type Game = {
  _id: string,
  name: string,
  score_requirements: Object
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[] | { message: string }>
) {
  try {
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const games = await db
      .collection("games")
      .find({}, { projection: { creator_id: 0 } })
      .toArray();
    
    const gamesWithIdAsString = games.map(game => ({
      _id: game._id.toString(),
      name: game.name,
      score_requirements: {
        ...game.score_requirements,
        player_name: "string"
      }
    }));

    return res.status(200).json(gamesWithIdAsString);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An unexpected error occurred when finding games"});
  }
}
