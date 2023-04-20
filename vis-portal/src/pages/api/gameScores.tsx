import type { NextApiRequest, NextApiResponse } from 'next'

export type Score = {
  _id: string,
  player_id: string,
  game_id: string,
  level?: string,
  time_taken_seconds: number,
  category?: string,
  correct?: boolean,
  coins_collected?: number,
  obstacles_hit?: number,
  score?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Score[]>
) {
  // use NextApiRequest to call on API Endpoint to retrieve Data
  const response = await fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-yysqb/endpoint/get_all_games", {
    headers: {
      'Content-Type': 'application/json',
      'apiKey': `${process.env.MONGODB_REALMS_API_KEY}`
    }
  });
  const data = await response.json();

  res.status(200).json(data);
}
