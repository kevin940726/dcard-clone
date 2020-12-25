import { getSearchForums } from '../../../apis';

export default async function searchForumsHandler(req, res) {
  const { query, ...queries } = req.query;
  const searchForums = await getSearchForums(query, queries);

  res.status(200).json(searchForums);
}
