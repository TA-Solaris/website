export function countTags(posts) {
  const counts = new Map();

  for (const { tags = [] } of posts) {
    for (const tag of new Set(tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Object.fromEntries(
    [...counts].sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function filterPosts(posts, selectedTags) {
  return selectedTags.length
    ? posts.filter((post) =>
        selectedTags.every((tag) => post.tags?.includes(tag)),
      )
    : posts;
}
