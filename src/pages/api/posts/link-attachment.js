import { getLinkAttachment } from '../../../apis';

export default async function linkAttachmentHandler(req, res) {
  const linkAttachment = await getLinkAttachment(req.query.url);

  if (!linkAttachment) {
    res.status(404).end();
    return;
  }

  res.status(200).json(linkAttachment);
}
