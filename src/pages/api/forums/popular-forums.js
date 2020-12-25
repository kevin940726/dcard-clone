import { getPopularForums } from '../../../apis';

export default async function popularForumsHandler(req, res) {
  const popularForums = await getPopularForums(req.query);

  res.status(200).json(popularForums);
}
