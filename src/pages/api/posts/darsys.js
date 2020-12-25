import { getDarsys } from '../../../apis';

export default async function postsHandler(req, res) {
  const darsys = await getDarsys(req.query.postID);

  res.status(200).json(darsys);
}
