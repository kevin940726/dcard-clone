export function filterQuery(query) {
  const filtered = {};

  for (const key of Object.keys(query)) {
    if (query[key] != null) {
      filtered[key] = query[key];
    }
  }

  return filtered;
}
