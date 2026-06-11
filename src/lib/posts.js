const postsUrl = "/posts.json";
const postHtmlCache = new Map();
const preloadedImages = new Set();

let postsPromise = null;

function sortPosts(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function assertOk(response) {
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response;
}

export function fetchPosts() {
  if (!postsPromise) {
    postsPromise = fetch(postsUrl)
      .then(assertOk)
      .then((response) => response.json())
      .then(sortPosts)
      .catch((error) => {
        postsPromise = null;
        throw error;
      });
  }

  return postsPromise;
}

export function fetchPostHtml(slug) {
  if (!postHtmlCache.has(slug)) {
    const request = fetch(`/posts/${slug}.html`)
      .then(assertOk)
      .then((response) => response.text())
      .catch((error) => {
        postHtmlCache.delete(slug);
        throw error;
      });

    postHtmlCache.set(slug, request);
  }

  return postHtmlCache.get(slug);
}

export function preloadImage(src, fetchPriority = "auto") {
  if (!src || preloadedImages.has(src) || typeof document === "undefined") {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  link.fetchPriority = fetchPriority;
  document.head.append(link);
  preloadedImages.add(src);
}

export function prefetchPost(slug) {
  fetchPostHtml(slug).catch(() => {});
}

export function runWhenIdle(callback, timeout = 1500) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(idleId);
  }

  const timerId = window.setTimeout(callback, 1);
  return () => window.clearTimeout(timerId);
}

export function warmPostAssets(posts, count = 2) {
  return runWhenIdle(() => {
    posts.slice(0, count).forEach((post, index) => {
      prefetchPost(post.slug);
      preloadImage(post.cover, index === 0 ? "high" : "auto");
    });
  });
}
