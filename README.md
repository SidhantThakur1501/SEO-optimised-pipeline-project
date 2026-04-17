# SEO Blog Generator

A local-first SEO content workflow app built with React and Vite.

This project helps turn a raw blog topic into a more structured, publish-ready content draft by guiding the user through a step-by-step pipeline: keyword input, search intent analysis, SERP-style gap analysis, keyword clustering, prompt building, content generation, SEO validation, and a final quality review.

## Why this project exists

Writing SEO content usually involves jumping between keyword notes, search intent research, outlines, prompts, drafts, and quality checks. This project brings those stages into one guided workflow so the process feels more consistent and easier to follow.

It is designed as a local-first demo application, which means the project can run without a hosted backend and uses local data/storage for the content workflow experience.

## Core workflow

The app moves a content project through these stages:

1. Keyword input
2. Intent classification
3. SERP analysis
4. Keyword clustering
5. Prompt building
6. Content generation
7. SEO validation
8. Quality gate
9. Publish-ready output

## Features

- Create and manage SEO content projects
- Track project progress through a multi-step pipeline
- Classify keyword intent into practical search categories
- Generate SERP-style content gap recommendations
- Group related keywords into thematic clusters
- Build structured prompts for content generation
- Generate a draft article from the workflow data
- Score output with SEO checks and quality checks
- Store projects locally for a simple no-backend experience

## Demo

This repository includes a small CLI demo that runs the pipeline without opening the UI.

```bash
npm run demo
```

That script processes a sample content brief and prints a JSON summary containing:

- project status
- SEO score
- GEO score
- quality score
- meta title and description
- prompt preview
- article preview

If you want to make the GitHub repository look stronger, add:

- a screenshot at `docs/demo.png`
- an optional short walkthrough video at `docs/demo.mp4`

Then place this in the README where you want the screenshot to appear:

```md
![SEO Blog Generator demo](docs/demo.png)
```

## Tech stack

- React 18
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Radix UI components

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Environment variables

This project can run in local/demo mode without real hosted credentials.

If you want to define the optional app parameters, create a `.env` file based on `.env.example`:

```env
VITE_BASE44_APP_ID=
VITE_BASE44_FUNCTIONS_VERSION=
VITE_BASE44_APP_BASE_URL=
```

## Project structure

```text
SEOblogGen/
|-- src/
|   |-- api/                # Local API shim
|   |-- components/         # UI, layout, and pipeline step components
|   |-- hooks/              # Shared hooks
|   |-- lib/                # Pipeline engine, auth, storage, utilities
|   |-- pages/              # Dashboard, projects, new project, pipeline
|   `-- utils/              # App entry and global styles
|-- scripts/
|   `-- pipeline-demo.mjs   # CLI demo script
|-- docs/
|   `-- DEMO.md             # Demo guidance
|-- entities/               # Local entity data
|-- index.html
|-- package.json
|-- package-lock.json
|-- tailwind.config.js
|-- postcss.config.js
|-- vite.config.js
`-- README.md
```

## What makes it useful

- It turns SEO content creation into a visible workflow instead of a scattered process
- It is easy to run locally and simple to demonstrate
- It showcases frontend state management, pipeline design, local persistence, and content-scoring logic in one project

## Repository notes

These folders should not be committed:

- `node_modules/`
- `dist/`
- `.vite/`
- `.env`
- `.run/`
- `.codex/`
- `.tools/`

The repository already includes a `.gitignore` set up for that.

## Publishing this project on GitHub

If you are publishing manually with Git:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If you prefer GitHub Desktop, you can publish the folder visually and let GitHub Desktop handle the initial commit and push flow.

## Future improvements

- Add real screenshot and video demo assets
- Improve code splitting for a smaller production bundle
- Add export options for generated briefs or articles
- Add tests for pipeline engine logic
- Add richer project analytics and publishing history

## License

No license has been added yet. If you want this project to be open for reuse, add a license such as MIT before sharing it widely.
