import { getOpenAIClient } from "@/lib/openai/client";
import type { VoicePreset } from "@/lib/types/story";

function voiceForPreset(voicePreset: VoicePreset): { voice: string; instructions: string } {
  switch (voicePreset) {
    case "playful-friend":
      return { voice: "coral", instructions: "Speak with bright, playful energy for children." };
    case "gentle-grandma":
      return { voice: "sage", instructions: "Speak slowly, warmly, and reassuringly like a gentle grandparent." };
    case "curious-explorer":
      return { voice: "echo", instructions: "Speak with expressive curiosity and upbeat wonder." };
    default:
      return { voice: "alloy", instructions: "Speak warmly, clearly, and softly for bedtime-style narration." };
  }
}

export async function generateSpeechAudio(input: string, voicePreset: VoicePreset): Promise<Buffer> {
  const client = getOpenAIClient();
  const voice = voiceForPreset(voicePreset);
  const speech = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice.voice,
    input,
    instructions: `${voice.instructions} Make it clear that this is a children's story narration.`,
    response_format: "mp3",
  });

  return Buffer.from(await speech.arrayBuffer());
}
