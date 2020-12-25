import { getTopicPosts } from '../../../apis';

export default async function topicPostsHandler(req, res) {
  const { topic, ...queries } = req.query;
  const topicPosts = await getTopicPosts(topic, queries);

  res.status(200).json(topicPosts);
}
