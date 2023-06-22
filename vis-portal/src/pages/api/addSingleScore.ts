import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import authenticationHandler from '../authentication/authenticationHandler';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const creator = await authenticationHandler(req, res);
    if (!creator) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const gameName = req.body.game;
    if (!gameName) {
      res.status(400).json({ message: "No game name provided" });
      return;
    }

    // verify that player_name and player_id are provided as they are required fields
    const playerName = req.body.player_name;
    if (!playerName) {
      res.status(400).json({ message: "Required field player_name not provided" });
      return;
    }
    const playerId = req.body.player_id;
    if (!playerId) {
      res.status(400).json({ message: "Required field player_id not provided" });
      return;
    }

    const client = await clientPromise;
    const db = client.db("games_and_scores");

    // find game by name regardless of case
    const game = await db
      .collection("games")
      .findOne({ name: { $regex: new RegExp(`^${gameName}$`, 'i') } });
    
    if (game) {
      // verify that the creator attempting to add a score is the same who added the game originally
      const gameCreatorId = creator._id.toString();
      const scoreCreatorId = game.creator_id.toString();
      if (scoreCreatorId != gameCreatorId) {
        res.status(403).json({ message: "Cannot add scores for a game unless you created it" });
        return;
      }

      // find the score requirements for the requested game
      const scoreRequirements = game.score_requirements;

      // validate that the number and types of fields provided align with the score requirements
      const score = req.body.score;
      for (const metric of Object.keys(score)) {
        if (!scoreRequirements.hasOwnProperty(metric) || typeof score[metric] !== scoreRequirements[metric]) {
          res.status(400).json({ message: 'The provided score violates the requirements specified by the game. Please adjust your request accordingly.' });
          return;
        }
      }

      // add the score to the collection
      const scoreToInsert = {
        game_id: new ObjectId(game._id),
        player_id: playerId,
        player_name: playerName,
        ...score
      };

      const addScoreResult = await db
        .collection("scores")
        .insertOne(scoreToInsert);

    } else {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }

    res.status(200).json({ message: "Score was successfully added!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An unexpected error occurred when adding the score"});
  }
}
