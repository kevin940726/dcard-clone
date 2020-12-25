import { getSearchTopics } from '../../../apis';

export default async function searchTopicsHandler(req, res) {
  const { query, ...queries } = req.query;
  const searchTopics = await getSearchTopics(query, queries);

  res.status(200).json(searchTopics);
}
