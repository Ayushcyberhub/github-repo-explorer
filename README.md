# GitHub Repo Explorer

A full-stack web application that allows users to search for any GitHub profile and view their public repositories.

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- API: GitHub REST API

## Features

- Search GitHub users by username
- View user profile details
- View public repositories
- Sort repositories by stars, name, or last updated date
- Backend proxy for GitHub API
- Error handling
- 60-second backend caching

## Project Structure

```text
github-repo-explorer/
├── Client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md