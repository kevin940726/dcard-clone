import { getInfinitePosts } from '../../../apis';

export default async function postsHandler(req, res) {
  const { popular, limit, ...queries } = req.query;
  const posts = await getInfinitePosts({
    popular: popular === 'true',
    limit: parseInt(limit, 10),
    ...queries,
  });

  res.status(200).json(posts);
}
