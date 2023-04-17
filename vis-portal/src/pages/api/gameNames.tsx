import type { NextApiRequest, NextApiResponse } from 'next'

export type Game = {
  uuid: string,
  gameName: string
}

const games: Game[] = [
  {uuid: "1234567890", gameName: "Fun Times"},
  {uuid: "0987654321", gameName: "Funner Times"},
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[]>
) {
  // use NextApiRequest to call on API Endpoint to retrieve Data
  res.status(200).json(games)
}
