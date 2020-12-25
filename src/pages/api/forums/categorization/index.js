import { getCategorization } from '../../../../apis';

export default async function categorizationHandler(req, res) {
  const categorization = await getCategorization(req.query);

  res.status(200).json(categorization);
}
