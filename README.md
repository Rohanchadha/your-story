# StorySpark

StorySpark is a premium AI storytelling web app for families. It turns a simple prompt into a child-friendly comic story with illustrated panels, narration, multilingual support, and a print-ready reading experience.

This repository contains the current MVP web experience built with Next.js and TypeScript.

## What The App Does

- Creates 6-panel illustrated stories from a parent or child prompt
- Supports two creation modes: `Adventure` and `Educational`
- Supports multiple languages including English, Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Punjabi, and Urdu
- Lets the storyteller choose an illustration style and narration voice
- Generates AI artwork and audio narration through server routes
- Includes a seeded library so the product feels complete even before any custom story is created
- Supports favorites, recents, and printable story layouts

## Current MVP Scope

The current MVP is intentionally web-only and optimized for a no-login demo flow.

Included now:

- Home page with Story of the Day, categories, recents, and favorites
- Create flow for live story generation
- Visual style preset picker
- Story reader with narration and panel-level artwork regeneration
- Print layout for A4-friendly offline reading
- Local-first persistence in the browser

Planned or partial:

- Child profiles exist in the codebase, but they are not part of the active create flow right now
- Memory-to-story remains a roadmap item
- Authentication and cloud sync are future phases

## Tech Stack

- `Next.js 15` with App Router
- `React 19`
- `TypeScript`
- `Vanilla CSS`
- `OpenAI API` for story text, image generation, and text-to-speech
- `localStorage` for MVP persistence

## Project Structure

```text
app/
  api/
    media/
    stories/
  create/
  favorites/
  library/
  stories/[id]/
  page.tsx

components/
  create/
  home/
  layout/
  shared/
  story-reader/

lib/
  constants/
  imagegen/
  openai/
  storage/
  story/
  types/
  utils/

public/
  images/
  generated/
```

## Local Development

### Requirements

- `Node.js 20+`
- `npm`
- `OPENAI_API_KEY` in `.env.local` for live AI generation

### Run The App

```bash
npm install
npm run dev
```

The local app runs at `http://127.0.0.1:3002` in this workspace setup.

### Useful Scripts

```bash
npm run dev
npm run build
npm run start
```

## Core Product Areas

### Story Creation

The create flow asks for:

- story mode
- prompt
- language
- age/complexity level
- illustration style
- narrator voice

It then generates:

- a structured 6-panel story
- AI artwork for each panel
- optional narration playback from the reader

### Story Reading

The reader includes:

- cover art
- panel-by-panel reading
- narration controls
- favorite action
- print action
- artwork regeneration

### Seeded Library

The MVP ships with curated stories and local cover art so the app feels alive before a user generates anything.

## Notes For Contributors

- The UI is intentionally warm, soft, and editorial rather than dashboard-like
- The app is currently local-first, so browser storage behavior matters
- API routes are the main boundary for AI integration
- Generated visual assets that are meant to be part of the product should live in the repo, not only in temporary model output locations

## Related Docs

- [PROJECT_OVERVIEW.md](/Users/rohanchadha/Documents/Playground/my-story/PROJECT_OVERVIEW.md)
