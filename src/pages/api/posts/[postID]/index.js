import { getPost } from '../../../../apis';

export default async function postHandler(req, res) {
  const { postID } = req.query;

  const post = await getPost(postID);

  res.status(200).json(post);
}
