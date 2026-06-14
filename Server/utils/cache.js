const cache = {};
const CACHE_TIME = 60 * 1000;

export const getCache = (key) => {
  const cachedItem = cache[key];

  if (!cachedItem) {
    return null;
  }

  const isExpired = Date.now() - cachedItem.timestamp > CACHE_TIME;

  if (isExpired) {
    delete cache[key];
    return null;
  }

  return cachedItem.data;
};

export const setCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};