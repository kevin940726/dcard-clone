import { getPersonaInfo } from '../../../apis';

export default async function personaInfoHandler(req, res) {
  const { persona } = req.query;
  const personaInfo = await getPersonaInfo(persona);

  res.status(200).json(personaInfo);
}
