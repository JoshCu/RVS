import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

export type Player = {
  player_id: string;
  player_name: string;
};

interface GameInfoResponse {
  scores: Record<string, any>[];
  players: Player[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameInfoResponse | { message: string }>
) {
  var gameId = req.query.game_id;

  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  if (Array.isArray(gameId)) {
    gameId = gameId[0];
  }

  try {
    const client = await clientPromise;
    const db = client.db("games_and_scores");

    // find the first 40 scores for the requested game
    const scores: Record<string, any>[] = await db
      .collection("scores")
      .find({ "game_id": new ObjectId(gameId) }, { projection: { _id: 0, game_id: 0} })
      .limit(40)
      .toArray();
    
    // find the distinct set of players associated with the first 40 scores
    const players = scores.reduce<Player[]>((acc, score) => {
      if (!acc.find(player => player.player_id === score.player_id)) {
        acc.push({ player_id: score.player_id, player_name: score.player_name });
      }
      return acc;
    }, []);
    
    return res.status(200).json({scores, players});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An unexpected error occurred when collecting game info"});
  }
}
