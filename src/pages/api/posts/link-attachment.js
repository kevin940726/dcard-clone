import { getLinkAttachment } from '../../../apis';

export default async function linkAttachmentHandler(req, res) {
  const linkAttachment = await getLinkAttachment(req.query.url);

  res.status(200).json(linkAttachment);
}
