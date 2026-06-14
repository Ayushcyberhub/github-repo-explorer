import express from "express";
import { getGithubUser } from "../controllers/githubController.js";

const router = express.Router();

router.get("/:username", getGithubUser);

export default router;