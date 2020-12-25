import { getComments } from '../../../../apis';

export default async function commentsHandler(req, res) {
  const { postID, ...query } = req.query;

  const comments = await getComments(postID, query);

  res.status(200).json(comments);
}
