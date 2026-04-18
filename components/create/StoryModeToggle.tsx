"use client";

import type { StoryMode } from "@/lib/types/story";
import { storyModes } from "@/lib/constants/story-config";

const modeIcons: Record<StoryMode, string> = {
  adventure: "/images/icons/adventure.svg",
  educational: "/images/icons/educational.svg",
};

type StoryModeToggleProps = {
  value: StoryMode;
  onChange: (value: StoryMode) => void;
};

export function StoryModeToggle({ value, onChange }: StoryModeToggleProps) {
  return (
    <div className="stack-sm">
      <div>
        <p className="eyebrow">Step 1</p>
        <h2>Choose a story type</h2>
      </div>

      <div className="choice-grid">
        {storyModes.map((mode) => (
          <button
            key={mode.value}
            className={["choice-card", mode.value === value ? "choice-card--selected" : ""].filter(Boolean).join(" ")}
            onClick={() => onChange(mode.value)}
            type="button"
          >
            <img src={modeIcons[mode.value]} alt="" className="choice-card__icon" aria-hidden="true" />
            <strong>{mode.label}</strong>
            <span>{mode.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
