import { createId } from "@/lib/utils/ids";
import type { ChildProfile } from "@/lib/types/child";
import { readFromStorage, writeToStorage } from "@/lib/storage/browser-storage";

const CHILDREN_KEY = "lullaby_lane_children";

export function getChildren(): ChildProfile[] {
  return readFromStorage<ChildProfile[]>(CHILDREN_KEY, []);
}

export function saveChild(input: Omit<ChildProfile, "id" | "createdAt" | "updatedAt"> & { id?: string }): ChildProfile {
  const now = new Date().toISOString();
  const children = getChildren();

  const nextChild: ChildProfile = {
    id: input.id ?? createId("child"),
    name: input.name,
    nickname: input.nickname,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    city: input.city,
    country: input.country,
    createdAt: input.id ? children.find((child) => child.id === input.id)?.createdAt ?? now : now,
    updatedAt: now,
  };

  const nextChildren = input.id
    ? children.map((child) => (child.id === input.id ? nextChild : child))
    : [nextChild, ...children];

  writeToStorage(CHILDREN_KEY, nextChildren);
  return nextChild;
}

export function deleteChild(id: string): void {
  const nextChildren = getChildren().filter((child) => child.id !== id);
  writeToStorage(CHILDREN_KEY, nextChildren);
}
