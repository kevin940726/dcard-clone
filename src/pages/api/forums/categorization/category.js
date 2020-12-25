import { getCategory } from '../../../../apis';

export default async function categoryHandler(req, res) {
  const { categoryID, ...query } = req.query;

  const category = await getCategory(categoryID, query);

  res.status(200).json(category);
}
