import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/openai/client";
import { generateStoryPlanWithOpenAI } from "@/lib/openai/story-generation";
import { saveStoryJson } from "@/lib/storage/server-artifacts";
import { createStoryRecordFromContent, generateStoryRecord } from "@/lib/story/generate-story";
import type { StoryGenerateRequest } from "@/lib/types/story";

function isValidLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= 10;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<StoryGenerateRequest>;

  if (
    !body.prompt?.trim() ||
    !body.mode ||
    !body.language ||
    !body.stylePreset ||
    !body.voicePreset ||
    typeof body.level !== "number" ||
    !isValidLevel(body.level)
  ) {
    return NextResponse.json({ error: "Invalid story request." }, { status: 400 });
  }

  const storyRequest: StoryGenerateRequest = {
    prompt: body.prompt.trim(),
    mode: body.mode,
    language: body.language,
    level: body.level,
    stylePreset: body.stylePreset,
    voicePreset: body.voicePreset,
    childContext: body.childContext ?? null,
  };

  let story = generateStoryRecord(storyRequest);

  if (hasOpenAIKey()) {
    try {
      const livePlan = await generateStoryPlanWithOpenAI(storyRequest);
      story = createStoryRecordFromContent(storyRequest, {
        title: livePlan.title,
        summary: livePlan.summary,
        category: livePlan.category,
        paragraphs: livePlan.paragraphs,
      });
    } catch (error) {
      console.error("Falling back to local story generation:", error);
    }
  }

  await saveStoryJson(story);

  return NextResponse.json({ story });
}
