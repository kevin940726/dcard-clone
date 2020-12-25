import { getSearchPosts } from '../../../apis';

export default async function searchPostsHandler(req, res) {
  const { query, ...queries } = req.query;
  const searchPosts = await getSearchPosts(query, queries);

  res.status(200).json(searchPosts);
}
