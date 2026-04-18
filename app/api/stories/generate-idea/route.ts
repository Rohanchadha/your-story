import { NextResponse } from "next/server";
import { generateIdeas } from "@/lib/story/generate-ideas";
import type { StoryIdeaRequest } from "@/lib/types/story";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<StoryIdeaRequest>;

  if (!body.mode || !body.language || typeof body.level !== "number") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const ideas = generateIdeas({
    mode: body.mode,
    language: body.language,
    level: Math.max(1, Math.min(10, body.level)),
    childContext: body.childContext ?? null,
  });

  return NextResponse.json({ ideas });
}
