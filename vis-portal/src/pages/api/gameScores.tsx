import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>[]>
) {
  const gameId = req.query.game_id;

  if (!gameId) {
    res.status(400).json([]);
    return;
  }

  // use NextApiRequest to call on API Endpoint to retrieve Data
  const response = await fetch(`https://us-east-1.aws.data.mongodb-api.com/app/application-0-yysqb/endpoint/get_scores_by_game_id?game_id=${gameId}`, {
    headers: {
      'Content-Type': 'application/json',
      'apiKey': `${process.env.MONGODB_REALMS_API_KEY}`
    }
  });
  const data: Record<string, any>[] = await response.json();

  res.status(200).json(data);
}
