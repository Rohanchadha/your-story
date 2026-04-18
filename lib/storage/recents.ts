import { readFromStorage, writeToStorage } from "@/lib/storage/browser-storage";

const RECENTS_KEY = "lullaby_lane_recents";

export function getRecentStoryIds(): string[] {
  return readFromStorage<string[]>(RECENTS_KEY, []);
}

export function pushRecentStory(id: string): string[] {
  const nextRecents = [id, ...getRecentStoryIds().filter((storyId) => storyId !== id)].slice(0, 8);
  writeToStorage(RECENTS_KEY, nextRecents);
  return nextRecents;
}
