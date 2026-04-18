import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/openai/client";
import { generateSpeechAudio } from "@/lib/openai/speech-generation";
import type { VoicePreset } from "@/lib/types/story";

export async function POST(request: Request) {
  const body = (await request.json()) as { input?: string; voicePreset?: VoicePreset };

  if (!body.input?.trim() || !body.voicePreset) {
    return NextResponse.json({ error: "Missing speech input." }, { status: 400 });
  }

  if (!hasOpenAIKey()) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  try {
    const audio = await generateSpeechAudio(body.input.trim(), body.voicePreset);
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Speech generation failed:", error);
    return NextResponse.json({ error: "Speech generation failed." }, { status: 500 });
  }
}
