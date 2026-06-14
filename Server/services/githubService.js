import { getCache, setCache } from "../utils/cache.js";

export const fetchGithubUserData = async (username) => {
  const cacheKey = username.toLowerCase();

  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return {
      ...cachedData,
      fromCache: true,
    };
  }

  const profileResponse = await fetch(`https://api.github.com/users/${username}`);

  if (profileResponse.status === 404) {
    const error = new Error("GitHub user not found");
    error.statusCode = 404;
    throw error;
  }

  if (profileResponse.status === 403) {
    const error = new Error("GitHub API rate limit exceeded. Please try again later.");
    error.statusCode = 403;
    throw error;
  }

  if (!profileResponse.ok) {
    const error = new Error("Failed to fetch GitHub profile");
    error.statusCode = profileResponse.status;
    throw error;
  }

  const profile = await profileResponse.json();

  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  if (!reposResponse.ok) {
    const error = new Error("Failed to fetch repositories");
    error.statusCode = reposResponse.status;
    throw error;
  }

  const repos = await reposResponse.json();

  const result = {
    profile: {
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      html_url: profile.html_url,
    },
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      open_issues_count: repo.open_issues_count,
      default_branch: repo.default_branch,
    })),
    fromCache: false,
  };

  setCache(cacheKey, result);

  return result;
};