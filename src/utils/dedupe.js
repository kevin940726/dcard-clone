export default function dedupe(arr, getKey = (item) => item) {
  const set = new Set();
  const result = [];

  arr.forEach((item) => {
    const key = getKey(item);

    if (!set.has(key)) {
      result.push(item);
      set.add(key);
    }
  });

  return result;
}
