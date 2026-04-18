import { buildPanelPrompt } from "@/lib/imagegen/build-panel-prompt";
import { createCoverArtDataUrl, createPanelArtDataUrl } from "@/lib/story/build-panel-art";
import { createId } from "@/lib/utils/ids";
import type { ChildSnapshot, StoryGenerateRequest, StoryPanel, StoryRecord } from "@/lib/types/story";

type StoryContent = {
  title: string;
  summary: string;
  category: string;
  paragraphs: string[];
};

function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

function titleFromPrompt(prompt: string, mode: StoryGenerateRequest["mode"]): string {
  const cleaned = normalizePrompt(prompt).replace(/[^\w\s]/g, "");
  const words = cleaned.split(" ").filter(Boolean).slice(0, 5);
  const stem = words.map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  if (mode === "educational") {
    return stem ? `${stem} Storytime` : "Little Learning Storytime";
  }
  return stem ? `${stem} Adventure` : "The Cozy Little Adventure";
}

function categoryFromPrompt(prompt: string, mode: StoryGenerateRequest["mode"]): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("solar") || lower.includes("planet") || lower.includes("space")) return "Science Stories";
  if (lower.includes("math") || lower.includes("count")) return "Math Stories";
  if (lower.includes("history")) return "History Stories";
  if (lower.includes("honesty")) return "Honesty";
  if (lower.includes("kind") || lower.includes("help")) return "Being Helpful";
  return mode === "educational" ? "Learning Stories" : "Adventure";
}

function accentFromMode(mode: StoryGenerateRequest["mode"]): string {
  return mode === "educational" ? "#dff2ff" : "#ffe2d2";
}

function ageDescriptor(level: number): string {
  if (level <= 2) return "very young child";
  if (level <= 4) return "young child";
  if (level <= 7) return "curious child";
  return "older child";
}

function buildChildReference(childSnapshot?: ChildSnapshot | null): string {
  if (!childSnapshot?.name) return "a child";
  return childSnapshot.nickname || childSnapshot.name;
}

function buildSummary(request: StoryGenerateRequest, childSnapshot?: ChildSnapshot | null): string {
  const subject = request.mode === "educational" ? "explains a big idea" : "turns one bright prompt into a cozy adventure";
  const childPhrase = childSnapshot?.name ? ` for ${childSnapshot.name}` : "";
  return `A ${request.language} story that ${subject}${childPhrase} with level ${request.level} warmth and a ${request.stylePreset} mood.`;
}

function buildParagraphs(request: StoryGenerateRequest, childSnapshot?: ChildSnapshot | null): string[] {
  const subject = normalizePrompt(request.prompt);
  const leadName = buildChildReference(childSnapshot);
  const pacing = ageDescriptor(request.level);
  const cityDetail = childSnapshot?.city ? ` in ${childSnapshot.city}` : "";

  if (request.mode === "educational") {
    return [
      `${leadName[0]?.toUpperCase() + leadName.slice(1)} was settling in for story time${cityDetail} when a gentle guide named Mira opened a glowing picture book about ${subject}. Instead of starting with hard facts, Mira began with familiar things: everyday sounds, shapes, feelings, and the way a ${pacing} notices the world. Right away, the big idea felt closer and friendlier.`,
      `Mira explained ${subject} with simple comparisons. Whenever the idea felt too large, she turned it into something touchable: a parade, a playground, a kitchen table, or a neighborhood road. That made the lesson feel less like schoolwork and more like a conversation between patient friends.`,
      `${leadName[0]?.toUpperCase() + leadName.slice(1)} asked small questions, and each answer unlocked the next piece naturally. Mira never rushed. She repeated the most important ideas in fresh ways, showing how patterns, purpose, and feelings can help a child remember something new.`,
      `Soon the lesson began to sparkle with examples. If ${subject} had moving parts, Mira described how they work together. If it involved values like honesty or helpfulness, she showed how those choices change the people around us. The story stayed gentle, clear, and rooted in a child's daily world.`,
      `By the time the last page glowed, ${leadName} could explain ${subject} back in simple words. The idea no longer felt distant or confusing. It felt like a friendly tool, something that could be noticed, named, and understood a little more each day.`,
      `When the picture book closed, the room felt calm and bright. ${leadName[0]?.toUpperCase() + leadName.slice(1)} smiled because learning had arrived as a story, not a lecture. That meant the new idea could travel forward with wonder, confidence, and just enough magic to be remembered tomorrow.`,
    ];
  }

  return [
    `${leadName[0]?.toUpperCase() + leadName.slice(1)} heard about ${subject}${cityDetail} just as the day was turning gold, and that was enough to begin a wonder-filled adventure. The air seemed to hum with possibility, as if the world had been waiting for one brave question and one open heart.`,
    `The first clue appeared quickly: a curious sound, a flicker of color, or a helper who knew more than they first admitted. Instead of feeling scared, ${leadName} felt the good kind of surprise, the kind that makes tiny footsteps move forward while the heart whispers, "Let's see."`,
    `As the journey unfolded, every new place reflected a feeling or lesson hidden inside ${subject}. Friendly creatures, kind strangers, and clever details turned the path into something playful. Even the trickiest moment stayed soft enough for a ${pacing}, because the story always moved with warmth.`,
    `Then came the part that asked for courage. ${leadName[0]?.toUpperCase() + leadName.slice(1)} had to pause, notice, and make a gentle choice. It was not loud heroism that mattered most, but kindness, curiosity, and the willingness to keep going one small step at a time.`,
    `That choice changed the world around the adventure. Doors opened, worried faces relaxed, and the hidden meaning of ${subject} became clear. What seemed mysterious at first now felt almost like a friend, because understanding had grown right beside bravery.`,
    `By the time the sky turned soft again, ${leadName} came home carrying more than a memory. The adventure had left behind a lesson that felt light enough to hold and warm enough to share, which is often how the best stories stay with us.`,
  ];
}

function buildPanelTitle(index: number, mode: StoryGenerateRequest["mode"]): string {
  const adventureTitles = [
    "A Gentle Beginning",
    "The First Clue",
    "A Path Opens",
    "The Heart of the Journey",
    "A Brave Choice",
    "A Soft Landing",
  ];

  const educationalTitles = [
    "A Curious Question",
    "A Friendly Explanation",
    "Looking Closer",
    "Examples Everywhere",
    "Understanding Grows",
    "Learning Stays Warm",
  ];

  return (mode === "educational" ? educationalTitles : adventureTitles)[index] ?? `Panel ${index + 1}`;
}

function buildPanels(storyId: string, paragraphs: string[], request: StoryGenerateRequest): StoryPanel[] {
  return paragraphs.map((paragraph, index) => {
    const title = buildPanelTitle(index, request.mode);
    return {
      id: `${storyId}_panel_${index + 1}`,
      title,
      panelText: paragraph,
      narrationText: paragraph,
      imagePrompt: buildPanelPrompt({ title, panelText: paragraph }, request.stylePreset, request.mode),
      imageUrl: createPanelArtDataUrl({ title, panelText: paragraph }, request.stylePreset, request.mode),
      status: "ready",
    };
  });
}

export function createStoryRecordFromContent(request: StoryGenerateRequest, content: StoryContent): StoryRecord {
  const storyId = createId("story");
  const now = new Date().toISOString();
  const childSnapshot = request.childContext ?? null;
  const coverAccent = accentFromMode(request.mode);

  return {
    id: storyId,
    title: content.title,
    summary: content.summary,
    category: content.category,
    level: request.level,
    language: request.language,
    mode: request.mode,
    stylePreset: request.stylePreset,
    voicePreset: request.voicePreset,
    coverAccent,
    coverImageUrl: createCoverArtDataUrl(content.title, content.summary, request.stylePreset, coverAccent),
    prompt: request.prompt,
    fullText: content.paragraphs.join(" "),
    childSnapshot,
    panels: buildPanels(storyId, content.paragraphs, request),
    origin: "generated",
    createdAt: now,
    updatedAt: now,
    status: "ready",
  };
}

export function generateStoryRecord(request: StoryGenerateRequest): StoryRecord {
  const childSnapshot = request.childContext ?? null;

  return createStoryRecordFromContent(request, {
    title: titleFromPrompt(request.prompt, request.mode),
    summary: buildSummary(request, childSnapshot),
    category: categoryFromPrompt(request.prompt, request.mode),
    paragraphs: buildParagraphs(request, childSnapshot),
  });
}
