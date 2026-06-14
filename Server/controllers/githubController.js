import { fetchGithubUserData } from "../services/githubService.js";

export const getGithubUser = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const data = await fetchGithubUserData(username);

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
};