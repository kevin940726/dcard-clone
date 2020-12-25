import { getComments } from '../../../../apis';

export default async function commentsHandler(req, res) {
  const { postID, ...query } = req.query;

  const comments = await getComments(postID, query);

  if (!comments) {
    res.status(404);
    return;
  }

  res.status(200).json(comments);
}
