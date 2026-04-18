import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/openai/client";
import { generateStoryImage } from "@/lib/openai/image-generation";

export async function POST(request: Request) {
  const body = (await request.json()) as { prompt?: string };

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Missing image prompt." }, { status: 400 });
  }

  if (!hasOpenAIKey()) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  try {
    const imageUrl = await generateStoryImage(body.prompt.trim());
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error);
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
  }
}
