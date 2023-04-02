// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

export type Grade = {
  id: string,
  course: string,
  date: Date,
  grade: string,
  score: number,
}

const grades: Grade[] = [{id: "Ahmed", course: "Biology", date: new Date(), grade: "A", score: 99}, {id: "Douglas", course: "Biology", date: new Date(), grade: "C", score: 78}]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Grade[]>
) {
  // use NextApiRequest to call on API Endpoint to retrieve Data
  res.status(200).json(grades)
}
