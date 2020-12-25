import { getReactions } from '../../../apis';

export default async function reactionsHandler(req, res) {
  const reactions = await getReactions();

  res.status(200).json(reactions);
}
