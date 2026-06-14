import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [sortBy, setSortBy] = useState("stars");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);
    setRepos([]);
    setUsername(input.trim());

    try {
      const response = await fetch(
        `https://github-repo-explorer-s6a1.onrender.com/api/github/${input.trim()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();

      setProfile(data.profile);
      setRepos(data.repos);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === "stars") {
      return b.stargazers_count - a.stargazers_count;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "updated") {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }

    return 0;
  });

  return (
    <div className="app">
      <h1>GitHub Repo Explorer</h1>
      <p className="subtitle">
        Search any GitHub user and explore their public repositories.
      </p>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading">Loading...</p>}

      {error && <p className="error">{error}</p>}

      {profile && (
        <div className="profile-card">
          <img src={profile.avatar_url} alt={profile.login} />

          <div>
            <h2>{profile.name || profile.login}</h2>
            <p>{profile.bio || "No bio available"}</p>

            <div className="stats">
              <span>Followers: {profile.followers}</span>
              <span>Following: {profile.following}</span>
              <span>Repos: {profile.public_repos}</span>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repo-section">
          <div className="repo-header">
            <h2>Repositories of {username}</h2>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="stars">Sort by Stars</option>
              <option value="name">Sort by Name</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>

          <div className="repo-list">
            {sortedRepos.map((repo) => (
              <div key={repo.id} className="repo-card">
                <h3>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </h3>

                <p>{repo.description || "No description available"}</p>

                <div className="repo-info">
                  <span>Language: {repo.language || "N/A"}</span>
                  <span>Stars: {repo.stargazers_count}</span>
                  <span>Issues: {repo.open_issues_count}</span>
                  <span>Branch: {repo.default_branch}</span>
                  <span>
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && profile && repos.length === 0 && (
        <p className="empty">No repositories found.</p>
      )}
    </div>
  );
}

export default App;