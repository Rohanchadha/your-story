# Project Overview

## What This Project Is

Bedtime is an AI-first storytelling product for parents and children. The experience is designed to feel premium, warm, and simple: a parent gives a prompt, chooses the storytelling mood, and receives a complete illustrated story that can be read on screen, narrated aloud, or printed for offline use.

The product sits at the intersection of:

- bedtime storytelling
- early childhood learning
- visual comic-style reading
- multilingual family experiences

## Product Vision

The goal is to make it easy for busy families to create stories that still feel thoughtful and personal.

Instead of asking parents to manually assemble books, characters, and scenes, the app handles the creative production:

- story generation
- panel structure
- visual art
- narration
- printable formatting

The long-term direction is a premium storytelling studio for families, not just a single prompt box.

## Current Experience

### 1. Home

The home page introduces the product and gives quick access to:

- Story of the Day
- popular story categories
- recent stories
- favorite stories
- educational storytelling entry points

The seeded stories are important because they reduce empty-state friction and make the demo feel complete.

### 2. Create Flow

The active create flow is currently streamlined around story generation itself. The user chooses:

- `Adventure` or `Educational`
- a story or learning prompt
- story level
- language
- illustration style
- narrator voice

The style picker is visual so the user understands the art direction before generation starts.

### 3. Story Reader

Once generated, each story opens into a reader with:

- cover art
- panel-by-panel scene reading
- narration controls
- favorite and print actions
- AI artwork regeneration

The reader is designed to feel like a premium comic-book reading surface rather than a plain text page.

### 4. Print Mode

Stories can be printed in a clean A4-friendly layout so parents can use them away from screens.

## AI Capabilities

The app currently uses OpenAI-backed server routes for:

- story text generation
- story idea generation
- image generation
- speech generation

There are also fallback paths and seeded content so the experience remains usable even when live generation is unavailable or delayed.

## Storage Model

The current MVP is local-first.

Stories, favorites, recents, and media overrides are stored locally in the browser. This keeps the prototype fast and simple while leaving room for a future hosted data layer.

There is no required login in the current flow.

## Design Principles

The UI aims to feel:

- soft and child-friendly
- premium rather than toy-like
- calm rather than noisy
- visual-first rather than form-heavy

That means:

- editorial typography
- warm surfaces
- image-led selection where useful
- fewer dashboard patterns
- clear CTAs and low-friction creation

## What Is In Scope Right Now

- Web experience only
- No-login prototype
- Live AI story generation
- Live AI image generation
- Live AI narration path
- Seeded story library
- Favorites and recents
- Print-friendly reading
- Educational stories in MVP

## What Is Not Fully Active Yet

- Child profiles are present in the codebase, but not currently part of the live create flow
- Memory-to-story is not yet a fully built feature
- Authentication and de-authorization are later-phase work
- Cloud persistence and cross-device syncing are future additions

## Key Architectural Choices

### Next.js App Router

Used for:

- page routing
- colocated API routes
- secure server-side access to OpenAI APIs

### TypeScript

Used to keep story data, panel data, and storage flows strongly typed.

### Vanilla CSS

Used to keep visual control high and styling lightweight for this prototype.

### Local Browser Storage

Used because the current phase prioritizes speed of iteration and demo quality over backend complexity.

## Important Project Files

- [app/page.tsx](/Users/rohanchadha/Documents/Playground/my-story/app/page.tsx)
- [app/create/page.tsx](/Users/rohanchadha/Documents/Playground/my-story/app/create/page.tsx)
- [app/stories/[id]/page.tsx](/Users/rohanchadha/Documents/Playground/my-story/app/stories/[id]/page.tsx)
- [app/stories/[id]/print/page.tsx](/Users/rohanchadha/Documents/Playground/my-story/app/stories/[id]/print/page.tsx)
- [lib/story/generate-story.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/story/generate-story.ts)
- [lib/openai/story-generation.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/openai/story-generation.ts)
- [lib/openai/image-generation.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/openai/image-generation.ts)
- [lib/openai/speech-generation.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/openai/speech-generation.ts)
- [lib/storage/stories.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/storage/stories.ts)
- [lib/story/seeded.ts](/Users/rohanchadha/Documents/Playground/my-story/lib/story/seeded.ts)

## Summary

This project is a polished storytelling MVP for families. It combines AI generation, curated starter content, strong visual design, and print-ready reading into one product foundation that can later expand into richer family memory, profile, and account features.
