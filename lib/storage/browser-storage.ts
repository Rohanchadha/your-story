const isBrowser = typeof window !== "undefined";

export function readFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors for the demo scaffold.
  }
}
