import { getComment } from '../../../../apis';

export default async function commentHandler(req, res) {
  const { postID, floor } = req.query;

  const comment = await getComment(postID, parseInt(floor, 10));

  if (!comment) {
    res.status(404);
    return;
  }

  res.status(200).json(comment);
}
