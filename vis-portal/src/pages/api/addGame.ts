import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongo/mongodb';
import { MongoError } from 'mongodb';
import authenticationHandler from '../authentication/authenticationHandler';
import requestValidator from '../authentication/requestValidator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const validFields = ['name', 'score_requirements'];

    const creator = await authenticationHandler(req, res);
    if (!creator) {
      return res.status(403).json({ message: "Access denied"} );
    }

    if (!requestValidator(req.body, validFields)) {
      return res.status(400).json({ message: "Invalid request body. Please only provide name and score_requirements" });
    }

    const game = req.body;
    if (!game.hasOwnProperty('name')) {
      return res.status(400).json({ message: "name field was not provided" });
    } else if (!game.hasOwnProperty('score_requirements')) {
      return res.status(400).json({ message: "score_requirements field was not provided" });
    }

    const scoreRequirements = game.score_requirements;
    if (Object.keys(scoreRequirements).length < 2) {
      return res.status(400).json({ message: "Please provide at least two scoring parameters for visualization" });
    }
    
    const allowedTypes = ['string', 'number', 'boolean'];
    for (let key of Object.keys(scoreRequirements)) {
      const type = scoreRequirements[key];
      if (typeof type !== "string" || !allowedTypes.includes(type)) {
        return res.status(400).json({ message: `Invalid type for score requirement ${key}. Allowed types are: ${allowedTypes.join(', ')}` });
      }
    }

    // Append the creator_id to the user's request
    game.creator_id = creator._id;

    const client = await clientPromise;
    const db = client.db("games_and_scores");

    const result = await db
      .collection("games")
      .insertOne(game)

    return res.status(200).json({ message: "Game was successfully added", _id: result.insertedId });
  } catch (e) {
    console.error(e);
    if (e instanceof MongoError && e.code === 11000) {
      return res.status(409).json({ message: "Game name already exists. If you are the creator of this game, please disregard this message and begin adding scores." });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred when adding the game"});
    }
  }
}
