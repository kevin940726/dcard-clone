import { getForums } from '../../../apis';

export default async function forumHandler(req, res) {
  const { forumAlias } = req.query;

  const forums = await getForums();
  const forum = forums[forumAlias];

  res.status(200).json(forum);
}
