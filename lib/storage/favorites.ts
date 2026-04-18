import { readFromStorage, writeToStorage } from "@/lib/storage/browser-storage";

const FAVORITES_KEY = "lullaby_lane_favorites";

export function getFavoriteStoryIds(): string[] {
  return readFromStorage<string[]>(FAVORITES_KEY, []);
}

export function toggleFavoriteStory(id: string): string[] {
  const currentFavorites = getFavoriteStoryIds();
  const nextFavorites = currentFavorites.includes(id)
    ? currentFavorites.filter((favoriteId) => favoriteId !== id)
    : [id, ...currentFavorites];

  writeToStorage(FAVORITES_KEY, nextFavorites);
  return nextFavorites;
}
