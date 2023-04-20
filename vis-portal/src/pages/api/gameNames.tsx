import type { NextApiRequest, NextApiResponse } from 'next'

export type Game = {
  _id: string,
  name: string,
  creator: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[]>
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
