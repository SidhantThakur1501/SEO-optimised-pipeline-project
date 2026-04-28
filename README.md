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

## Screenshots

### Dashboard
![Dashboard](images/dashboard.png)

### Entering keywords
![keywords](images/keywords.png)
### intent classification
![intent](images/intent.png)
### SERP analysis
![serp](images/serp.png)
### Prompt builder
![promptBuilder](images/promptBuilder.png)
### generate blog content
![generate](images/generate.png)
### SEO score validator
![seo](images/seo.png)

### Quality check
![quality](images/quality.png)

### Final Output
![final](images/final.png)




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


## What makes it useful

- It turns SEO content creation into a visible workflow instead of a scattered process
- It is easy to run locally and simple to demonstrate
- It showcases frontend state management, pipeline design, local persistence, and content-scoring logic in one project

