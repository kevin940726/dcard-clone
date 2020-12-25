import { getComment } from '../../../../apis';

export default async function commentHandler(req, res) {
  const { postID, floor } = req.query;

  const comment = await getComment(postID, parseInt(floor, 10));

  res.status(200).json(comment);
}
