import { getBulletin } from '../../../apis';

export default async function bulletinHandler(req, res) {
  let { forumID } = req.query;

  const bulletin = await getBulletin(forumID);

  res.status(200).json(bulletin);
}
