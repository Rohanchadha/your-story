import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoryRecord } from "@/lib/types/story";

const ARTIFACTS_ROOT = path.join(process.cwd(), "public", "generated", "stories");

export const ARTIFACTS_PUBLIC_ROOT = "/generated/stories";

async function ensureStoryDir(storyId: string): Promise<string> {
  const dir = path.join(ARTIFACTS_ROOT, storyId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function decodeDataUrl(dataUrl: string): { buffer: Buffer; extension: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  let extension = "bin";
  if (mime.includes("png")) extension = "png";
  else if (mime.includes("jpeg") || mime.includes("jpg")) extension = "jpg";
  else if (mime.includes("webp")) extension = "webp";
  else if (mime.includes("mpeg") || mime.includes("mp3")) extension = "mp3";
  else if (mime.includes("wav")) extension = "wav";
  return { buffer, extension };
}

export async function saveStoryJson(story: StoryRecord): Promise<void> {
  try {
    const dir = await ensureStoryDir(story.id);
    const filePath = path.join(dir, "story.json");
    await fs.writeFile(filePath, JSON.stringify(story, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to persist story JSON:", error);
  }
}

export async function saveStoryImage(
  storyId: string,
  fileBaseName: string,
  dataUrl: string,
): Promise<string | null> {
  try {
    const decoded = decodeDataUrl(dataUrl);
    if (!decoded) return null;
    const dir = await ensureStoryDir(storyId);
    const fileName = `${fileBaseName}.${decoded.extension}`;
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, decoded.buffer);
    return `${ARTIFACTS_PUBLIC_ROOT}/${storyId}/${fileName}`;
  } catch (error) {
    console.error("Failed to persist story image:", error);
    return null;
  }
}

export async function saveStoryAudio(
  storyId: string,
  fileBaseName: string,
  audio: Buffer,
  extension = "mp3",
): Promise<string | null> {
  try {
    const dir = await ensureStoryDir(storyId);
    const fileName = `${fileBaseName}.${extension}`;
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, audio);
    return `${ARTIFACTS_PUBLIC_ROOT}/${storyId}/${fileName}`;
  } catch (error) {
    console.error("Failed to persist story audio:", error);
    return null;
  }
}
