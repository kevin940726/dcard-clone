import { useMemo } from 'react';

export default function ForumPostsFrequency({ forum }) {
  const { last30Days } = forum.postCount;
  const countFrequency = useMemo(() => {
    const countPerWeek = last30Days / 4;

    if (countPerWeek >= 35) {
      return `每天有 ${Math.ceil(countPerWeek / 7)} 則貼文`;
    } else if (countPerWeek >= 5) {
      return `每週有 ${Math.ceil(countPerWeek)} 則貼文`;
    } else if (countPerWeek > 0) {
      return `每月有 ${last30Days} 則貼文`;
    } else {
      return `這裡是專屬於${forum.name}的版面。`;
    }
  }, [last30Days, forum.name]);

  return countFrequency;
}
