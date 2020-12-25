import { getSelectedForums } from '../../../apis';

export default async function selectedForumsHandler(req, res) {
  const selectedForums = await getSelectedForums(req.query);

  res.status(200).json(selectedForums);
}
