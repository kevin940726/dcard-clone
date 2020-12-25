import { getSearchPersonas } from '../../../apis';

export default async function searchPersonasHandler(req, res) {
  const { query, ...queries } = req.query;
  const searchPersonas = await getSearchPersonas(query, queries);

  res.status(200).json(searchPersonas);
}
