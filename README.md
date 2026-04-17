# SEO Blog Generator

A local-first React + Vite app for building SEO blog projects through a structured content pipeline.

## What this project does

- Collects blog topic and keyword inputs
- Classifies search intent
- Analyzes SERP-style content gaps
- Clusters keywords into content sections
- Builds a generation prompt
- Produces a draft article
- Runs SEO and quality checks before publish

## Project structure

```text
SEOblogGen/
|-- src/
|   |-- api/                # Local API shim
|   |-- components/         # Layout, pipeline, and UI components
|   |-- hooks/              # Reusable hooks
|   |-- lib/                # Pipeline engine, auth, storage, helpers
|   |-- pages/              # App screens
|   `-- utils/              # App entrypoint and styles
|-- scripts/
|   `-- pipeline-demo.mjs   # CLI demo of the content pipeline
|-- entities/               # Local entity data
|-- index.html
|-- package.json
|-- package-lock.json
|-- tailwind.config.js
|-- postcss.config.js
|-- vite.config.js
`-- README.md
```

## Files you should put on GitHub

Commit these:

- `src/`
- `scripts/`
- `entities/`
- `index.html`
- `package.json`
- `package-lock.json`
- `jsconfig.json`
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.js`
- `.gitignore`
- `.env.example`
- `README.md`

Do not commit these:

- `node_modules/`
- `dist/`
- `.vite/`
- `.env`
- `.run/`
- `.codex/`
- `.tools/`
- local logs or coverage output

## Local setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Demonstration

This repo includes a scriptable demo that runs the pipeline without needing the UI:

```bash
npm run demo
```

The demo uses a sample topic, runs intent classification, SERP analysis, keyword clustering, prompt generation, content generation, SEO validation, and a quality gate, then prints a JSON summary.

For a GitHub demonstration, add one or both of these to the repository:

1. A screenshot of the dashboard or pipeline page in `docs/demo.png`
2. A short screen recording uploaded to the repo or linked in the README

Once you have a screenshot, add it here:

```md
![SEO Blog Generator demo](docs/demo.png)
```

## How to upload this project to GitHub

1. Create a new empty repository on GitHub.
2. In this project folder, initialize git:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Notes

- Keep real secrets in `.env`, not in the repo.
- If you do not use the optional `VITE_BASE44_*` values, the app still works in local/demo mode.
- Commit `package-lock.json` so installs are reproducible for anyone viewing your GitHub project.
