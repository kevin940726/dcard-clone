import { getPostPreview } from '../../../../apis';

export default async function postHandler(req, res) {
  const { postID } = req.query;

  const postPreview = await getPostPreview(postID);

  if (!postPreview || !postPreview.length) {
    res.status(404).end();
    return;
  }

  res.status(200).json(postPreview[0]);
}
