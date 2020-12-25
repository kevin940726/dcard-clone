import { getForums } from '../../../apis';

export default async function forumsHandler(req, res) {
  const forums = await getForums(req.query);

  res.status(200).json(forums);
}
