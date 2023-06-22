import type { NextApiRequest } from 'next';

export default function requestValidator(
  body: string[],
  validFields: string[]
) {
  return Object.keys(body).every(key => validFields.includes(key));
};
