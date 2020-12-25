import { getInfinitePosts } from '../../../apis';

export default async function postsHandler(req, res) {
  const posts = await getInfinitePosts(req.query);

  res.status(200).json(posts);
}
