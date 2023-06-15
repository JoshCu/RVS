import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>[]>
) {
  var gameId = req.query.game_id;

  if (!gameId) {
    res.status(400).json([]);
    return;
  }

  if (Array.isArray(gameId)) {
    gameId = gameId[0];
  }

  try {
    console.log(gameId);
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const scores: Record<string, any>[] = await db
      .collection("scores")
      .find({ "game_id": new ObjectId(gameId) })
      .limit(40)
      .toArray();
    
    res.status(200).json(scores);
  } catch (e) {
    console.error(e);
  }
}
