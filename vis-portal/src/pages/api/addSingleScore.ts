import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import authenticationHandler from '../authentication/authenticationHandler';
import requestValidator from '../authentication/requestValidator';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const validFields = ['game', 'player_name', 'player_id', 'score'];

    const creator = await authenticationHandler(req, res);
    if (!creator) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!requestValidator(req.body, validFields)) {
      return res.status(400).json({ message: "Invalid request body. Please only provide game, player_name, player_id, and score" });
    }

    const gameName = req.body.game;
    if (!gameName) {
      return res.status(400).json({ message: "No game name provided" });
    }

    // verify that player_name and player_id are provided as they are required fields
    const playerName = req.body.player_name;
    if (!playerName) {
      return res.status(400).json({ message: "Required field player_name not provided" });
    }
    const playerId = req.body.player_id;
    if (!playerId) {
      return res.status(400).json({ message: "Required field player_id not provided" });
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
        return res.status(403).json({ message: "Cannot add scores for a game unless you created it" });
      }

      // find the score requirements for the requested game
      const scoreRequirements = game.score_requirements;

      // validate that the number and types of fields provided align with the score requirements
      const score = req.body.score;
      if (!score || typeof score !== 'object' || Array.isArray(score)) {
        return res.status(400).json({ message: "The score was not provided or is not an object." });
      }

      if (Object.keys(score).length < Object.keys(scoreRequirements).length) {
        return res.status(400).json({ message: `Too few metrics provided for score. Please adjust your score to include all metrics specified by ${game.name}`})
      }

      for (const metric of Object.keys(score)) {
        if (!scoreRequirements.hasOwnProperty(metric) || typeof score[metric] !== scoreRequirements[metric]) {
          return res.status(400).json({ message: "The provided score violates the requirements specified by the game. Please adjust your request accordingly." });
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
      return res.status(400).json({ message: "Invalid game ID" });
    }

    return res.status(200).json({ message: "Score was successfully added!" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An unexpected error occurred when adding the score"});
  }
}
