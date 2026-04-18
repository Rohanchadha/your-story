# Bedtime

Bedtime is a premium AI storytelling web app for families. It turns a simple prompt into a child-friendly comic story with illustrated panels, narration, multilingual support, and a print-ready reading experience.

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

- Home page with Story of the Day, category grid, recents, and favorites rows
- Streamlined create flow with `Adventure` and `Educational` modes
- Visual illustration style picker (cozy anime, minimal pastel, soft watercolor, playful pencil, storybook cartoon)
- Narrator voice picker with voice presets and matching SVG icons
- Multilingual story generation (English, Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Punjabi, Urdu)
- "Surprise me" AI-generated story idea helper on the create page
- Story reader with cover art, per-panel illustrations, narration playback, and panel-level artwork regeneration
- Favorites and recents tracking
- A4-friendly print layout for offline reading
- Seeded story library with committed cover art, panel images, and narration MP3s under `public/generated/stories/`
- Local-first persistence in the browser via `localStorage`

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

## OpenAI Capabilities Used

All OpenAI calls run server-side through Next.js App Router API routes in `app/api/`, so the API key is never exposed to the browser. The thin OpenAI wrappers live in `lib/openai/`.

| Capability | Model | API | Where it is used | Server route |
| --- | --- | --- | --- | --- |
| Story text generation | `gpt-5.2` | `responses.create` | Generates the structured 6-panel story (title, panels, narration text) from the parent prompt, language, level, and mode. | `app/api/stories/route.ts` |
| Story idea generation | `gpt-5.2` | `responses.create` | Powers the "Surprise me" idea button on the create page so parents get a fresh prompt suggestion. | `app/api/stories/generate-idea/route.ts` |
| Illustration generation | `gpt-image-1-mini` | `images.generate` | Renders the cover and each panel illustration using a style-aware prompt and the chosen visual preset. Also used when a user regenerates artwork from the reader. | `app/api/media/image/route.ts` |
| Narration (text-to-speech) | `gpt-4o-mini-tts` | `audio.speech.create` | Converts panel narration text into the selected narrator voice (`warm-parent`, `gentle-grandma`, `playful-friend`, `curious-explorer`) and saves the MP3 alongside the story. | `app/api/media/speech/route.ts` |

Supporting design choices:

- Every model call has a deterministic fallback path so the app stays usable when the API is unavailable or a key is missing.
- Generated images and audio for committed stories are persisted under `public/generated/stories/<storyId>/` so the seeded library renders without re-hitting the API.
- Prompt construction is centralized in `lib/story/` and `lib/imagegen/` so model upgrades only touch one layer.

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

## Phase 2 Roadmap

The next phase moves Bedtime from a single-prompt creator into a personalized, daily storytelling companion for each family.

### 1. Child Profiles And Personalized Stories

Storytellers will be able to create one or more child profiles (name, age, interests, favorite themes, language preference, reading level). Profile data already lives in `lib/storage/children.ts` and `lib/types/child.ts`; phase 2 wires it into the live create flow so:

- Every new story is automatically personalized to the selected child profile
- The child becomes the protagonist where appropriate
- Story tone, vocabulary, and length adapt to the child's age and reading level
- Illustration prompts incorporate the child's appearance and interests

### 2. Daily Personalized Journey With Codex Automations

Each child profile will get a daily story moment, fully automated.

- A scheduled Codex automation generates a fresh "Story of the Day" for each child overnight, tailored to their profile, recent reads, and learning goals
- A second Codex automation sends a notification to the storyteller through their preferred channel (WhatsApp, Telegram, or email) when the story is ready
- The notification deep-links straight into the reader, so the parent can open the app and read or play the narration to the child without any setup
- Over time this becomes a quiet daily ritual rather than a one-off generation flow

### 3. Memory-To-Story From Personal Images

Storytellers will be able to upload a personal image (for example, a photo from a Paris trip, a birthday, or a beach day) and turn it into a story.

- The uploaded image is interpreted by a vision-capable model to extract characters, setting, and mood
- That context is fed into the existing story-generation pipeline so the resulting narrative is grounded in the family's real memory
- Illustrations are then generated in the chosen art style, keeping the spirit of the original photo without reproducing it literally
- The result is a personalized comic that turns real family moments into bedtime stories



- [PROJECT_OVERVIEW.md](/Users/rohanchadha/Documents/Playground/my-story/PROJECT_OVERVIEW.md)
