import { readFromStorage, writeToStorage } from "@/lib/storage/browser-storage";
import { getFavoriteStoryIds } from "@/lib/storage/favorites";
import { getRecentStoryIds } from "@/lib/storage/recents";
import { normalizeParagraphs } from "@/lib/story/generate-story";
import { getSeededStoryById, seededStories } from "@/lib/story/seeded";
import type { StoryRecord, StorySummary } from "@/lib/types/story";

const STORIES_KEY = "lullaby_lane_generated_stories";
const STORY_MEDIA_KEY = "lullaby_lane_story_media";

type StoryMediaOverride = {
  storyId: string;
  coverImageUrl?: string;
  narrationAudioUrl?: string;
  panelImages?: Record<string, string>;
  updatedAt: string;
};

function normalizeStoredStory(story: StoryRecord): StoryRecord {
  const paragraphSource = story.panels.map((panel) => panel.panelText);
  const normalizedParagraphs = normalizeParagraphs(paragraphSource, story.fullText);

  return {
    ...story,
    fullText: normalizedParagraphs.join(" "),
    panels: story.panels.map((panel, index) => {
      const nextText = normalizedParagraphs[index] ?? panel.panelText ?? "";
      return {
        ...panel,
        panelText: nextText,
        narrationText: panel.narrationText?.trim() ? panel.narrationText : nextText,
      };
    }),
  };
}

export function getGeneratedStories(): StoryRecord[] {
  return readFromStorage<StoryRecord[]>(STORIES_KEY, []).map(normalizeStoredStory);
}

export function saveGeneratedStory(story: StoryRecord): StoryRecord {
  const existingStories = getGeneratedStories();
  const normalizedStory = normalizeStoredStory(story);
  const nextStories = [normalizedStory, ...existingStories.filter((item) => item.id !== story.id)];
  writeToStorage(STORIES_KEY, nextStories);
  return normalizedStory;
}

export function getGeneratedStoryById(id: string): StoryRecord | undefined {
  return getGeneratedStories().find((story) => story.id === id);
}

function getStoryMediaOverrides(): StoryMediaOverride[] {
  return readFromStorage<StoryMediaOverride[]>(STORY_MEDIA_KEY, []);
}

function saveStoryMediaOverride(override: StoryMediaOverride): StoryMediaOverride {
  const current = getStoryMediaOverrides();
  const next = [override, ...current.filter((item) => item.storyId !== override.storyId)];
  writeToStorage(STORY_MEDIA_KEY, next);
  return override;
}

function applyMediaOverride(story: StoryRecord): StoryRecord {
  const media = getStoryMediaOverrides().find((item) => item.storyId === story.id);
  if (!media) return normalizeStoredStory(story);

  return normalizeStoredStory({
    ...story,
    coverImageUrl: media.coverImageUrl ?? story.coverImageUrl,
    narrationAudioUrl: media.narrationAudioUrl ?? story.narrationAudioUrl,
    panels: story.panels.map((panel) => ({
      ...panel,
      imageUrl: media.panelImages?.[panel.id] ?? panel.imageUrl,
    })),
  });
}

export function getStoryById(id: string): StoryRecord | undefined {
  const story = getSeededStoryById(id) ?? getGeneratedStoryById(id);
  return story ? applyMediaOverride(story) : undefined;
}

export function listStoriesByIds(ids: string[]): StoryRecord[] {
  return ids
    .map((id) => getStoryById(id))
    .filter((story): story is StoryRecord => Boolean(story));
}

export function getFavoriteStories(): StoryRecord[] {
  return listStoriesByIds(getFavoriteStoryIds());
}

export function getRecentStories(): StoryRecord[] {
  return listStoriesByIds(getRecentStoryIds());
}

export function listAllStorySummaries(): StorySummary[] {
  const favoriteIds = new Set(getFavoriteStoryIds());

  const generatedSummaries = getGeneratedStories().map((story) => ({
    id: story.id,
    title: story.title,
    summary: story.summary,
    category: story.category,
    level: story.level,
    language: story.language,
    mode: story.mode,
    stylePreset: story.stylePreset,
    voicePreset: story.voicePreset,
    coverAccent: story.coverAccent,
    coverImageUrl: story.coverImageUrl,
    isFavorite: favoriteIds.has(story.id),
  }));

  const seededSummaries = seededStories.map((story) => ({
    ...story,
    isFavorite: favoriteIds.has(story.id),
  }));

  return [...generatedSummaries, ...seededSummaries];
}

export function persistStoryPanelImages(storyId: string, panelImages: Record<string, string>): StoryRecord | undefined {
  const story = getStoryById(storyId);
  if (!story) return undefined;

  const existing = getStoryMediaOverrides().find((item) => item.storyId === storyId);
  saveStoryMediaOverride({
    storyId,
    coverImageUrl: existing?.coverImageUrl ?? story.coverImageUrl,
    narrationAudioUrl: existing?.narrationAudioUrl ?? story.narrationAudioUrl,
    panelImages: {
      ...(existing?.panelImages ?? {}),
      ...panelImages,
    },
    updatedAt: new Date().toISOString(),
  });

  return getStoryById(storyId);
}

export function persistStoryCoverImage(storyId: string, coverImageUrl: string): StoryRecord | undefined {
  const story = getStoryById(storyId);
  if (!story) return undefined;

  const existing = getStoryMediaOverrides().find((item) => item.storyId === storyId);
  saveStoryMediaOverride({
    storyId,
    coverImageUrl,
    narrationAudioUrl: existing?.narrationAudioUrl ?? story.narrationAudioUrl,
    panelImages: existing?.panelImages ?? {},
    updatedAt: new Date().toISOString(),
  });

  return getStoryById(storyId);
}

export function persistStoryNarrationAudio(storyId: string, narrationAudioUrl: string): StoryRecord | undefined {
  const story = getStoryById(storyId);
  if (!story) return undefined;

  const existing = getStoryMediaOverrides().find((item) => item.storyId === storyId);
  saveStoryMediaOverride({
    storyId,
    coverImageUrl: existing?.coverImageUrl ?? story.coverImageUrl,
    narrationAudioUrl,
    panelImages: existing?.panelImages ?? {},
    updatedAt: new Date().toISOString(),
  });

  return getStoryById(storyId);
}
