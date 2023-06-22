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
    const validFields = ['game', 'scores'];
    var validatedScores = [];

    const creator = await authenticationHandler(req, res);
    if (!creator) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!requestValidator(req.body, validFields)) {
      return res.status(400).json({ message: "Invalid request body. Please only provide game and scores" });
    }

    const gameName = req.body.game;
    if (!gameName) {
      return res.status(400).json({ message: "No game name provided" });
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

      const scores = req.body.scores;
      if (!scores || !Array.isArray(scores)) {
        return res.status(400).json({ message: "The scores were not provided or are not an array"});
      }

      for (const playerScore of scores) {
        if (!playerScore || typeof playerScore !== 'object' || Array.isArray(playerScore)) {
          return res.status(400).json({ message: "One or more of the provided scores are not valid. Please adjust your request accordingly." })
        }

        const { player_id, player_name, score } = playerScore;
        
        if (!player_id || typeof player_id !== 'string') {
          return res.status(400).json({ message: "player_id was not provided or is not a string", problematicScore: playerScore });
        } else if (!player_name || typeof player_name !== 'string') {
          return res.status(400).json({ message: "player_name was not provided or is not a string", problematicScore: playerScore });
        } else if (!score || typeof score !== 'object' || Array.isArray(score)) {
          return res.status(400).json({ message: "score was not provided or is not an object", problematicScore: playerScore });
        }

        if (Object.keys(score).length < Object.keys(scoreRequirements).length) {
          return res.status(400).json({ message: `Too few metrics provided for score. Please adjust your score to include all metrics specified by ${game.name}`, problematicScore: playerScore })
        }

        for (const metric of Object.keys(score)) {
          if (!scoreRequirements.hasOwnProperty(metric) || typeof score[metric] !== scoreRequirements[metric]) {
            return res.status(400).json({ message: "The provided score violates the requirements specified by the game. Please adjust your request accordingly.", problematicScore: playerScore });
          }
        }

        const scoreToInsert = {
          game_id: new ObjectId(game._id),
          player_id: player_id,
          player_name: player_name,
          ...score
        };
        validatedScores.push(scoreToInsert);
      }
      const addScoresResult = await db
        .collection("scores")
        .insertMany(validatedScores);

    } else {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    return res.status(200).json({ message: "Score was successfully added!" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An unexpected error occurred when adding the score"});
  }
}
