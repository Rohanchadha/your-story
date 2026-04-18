import { getOpenAIClient } from "@/lib/openai/client";

export async function generateStoryImage(prompt: string): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.images.generate({
    model: "gpt-image-1-mini",
    prompt,
    size: "1024x1024",
    quality: "low",
  });

  const base64 = response.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("Image generation did not return image data.");
  }

  return `data:image/png;base64,${base64}`;
}
