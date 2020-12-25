import { getForums, getPopularForums, getSelectedForums } from '../../../apis';

export default async function sidebarForumsHandler(req, res) {
  const [forums, popularForums, selectedForums] = await Promise.all([
    getForums(),
    getPopularForums(),
    getSelectedForums(),
  ]);

  res.status(200).json({
    popularForums: popularForums.items
      .slice(0, 8)
      .map((forum) => forums[forum.alias]),
    selectedForums: selectedForums.map((forum) => forums[forum.alias]),
  });
}
