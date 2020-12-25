import { getTopicInfo } from '../../../apis';

export default async function topicInfoHandler(req, res) {
  const { topic } = req.query;
  const topicInfo = await getTopicInfo(topic);

  res.status(200).json(topicInfo);
}
