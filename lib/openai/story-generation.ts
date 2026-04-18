import { getOpenAIClient } from "@/lib/openai/client";
import type { StoryGenerateRequest } from "@/lib/types/story";

type StoryPlan = {
  title: string;
  summary: string;
  category: string;
  paragraphs: string[];
};

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object returned from story generation.");
  }

  return text.slice(start, end + 1);
}

function requestPrompt(input: StoryGenerateRequest): string {
  const child = input.childContext?.name
    ? `Selected child context: ${JSON.stringify(input.childContext)}. Use it gently for tone and familiarity, but do not force the child to be the protagonist.`
    : "No child context is selected. Keep the story broadly relatable.";

  return [
    "Create a children's story plan as strict JSON only.",
    `Story mode: ${input.mode}.`,
    `Language: ${input.language}.`,
    `Level: ${input.level} on a scale of 1-10, where 1 is very young and 10 is older children.`,
    `Illustration preset: ${input.stylePreset}.`,
    `Narration voice preset: ${input.voicePreset}.`,
    `Prompt from storyteller: ${input.prompt}.`,
    child,
    "Return only valid JSON with this exact shape:",
    '{"title":"string","summary":"string","category":"string","paragraphs":["string","string","string","string","string","string"]}',
    "Requirements:",
    "- Keep the story age-appropriate, warm, and emotionally safe.",
    "- Use exactly 6 paragraphs.",
    "- Each paragraph should be visually descriptive enough to become a comic panel.",
    "- Keep the full story around 300-450 words total.",
    "- For educational mode, explain ideas simply and accurately.",
    "- No markdown, no code fences, no commentary outside JSON.",
  ].join("\n");
}

export async function generateStoryPlanWithOpenAI(input: StoryGenerateRequest): Promise<StoryPlan> {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-5.2",
    input: requestPrompt(input),
  });

  const raw = response.output_text;
  const parsed = JSON.parse(extractJson(raw)) as Partial<StoryPlan>;

  if (
    !parsed.title ||
    !parsed.summary ||
    !parsed.category ||
    !Array.isArray(parsed.paragraphs) ||
    parsed.paragraphs.length !== 6 ||
    parsed.paragraphs.some((item) => typeof item !== "string" || !item.trim())
  ) {
    throw new Error("Story plan returned from OpenAI did not match the expected shape.");
  }

  return {
    title: parsed.title.trim(),
    summary: parsed.summary.trim(),
    category: parsed.category.trim(),
    paragraphs: parsed.paragraphs.map((item) => item.trim()),
  };
}
