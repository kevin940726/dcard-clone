import { getPersonaPosts } from '../../../apis';

export default async function personaPostsHandler(req, res) {
  const { persona, ...queries } = req.query;
  const personaPosts = await getPersonaPosts(persona, queries);

  res.status(200).json(personaPosts);
}
