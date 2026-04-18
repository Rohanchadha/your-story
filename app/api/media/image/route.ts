import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/openai/client";
import { generateStoryImage } from "@/lib/openai/image-generation";
import { saveStoryImage } from "@/lib/storage/server-artifacts";

export async function POST(request: Request) {
  const body = (await request.json()) as { prompt?: string; storyId?: string; panelId?: string };

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Missing image prompt." }, { status: 400 });
  }

  if (!hasOpenAIKey()) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  try {
    const imageUrl = await generateStoryImage(body.prompt.trim());

    let savedUrl: string | null = null;
    if (body.storyId) {
      const baseName = body.panelId ? `panel-${body.panelId}` : `image-${Date.now()}`;
      savedUrl = await saveStoryImage(body.storyId, baseName, imageUrl);
    }

    return NextResponse.json({ imageUrl: savedUrl ?? imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error);
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
  }
}
