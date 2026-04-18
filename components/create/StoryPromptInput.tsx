"use client";

import type { StoryMode } from "@/lib/types/story";

type StoryPromptInputProps = {
  mode: StoryMode;
  value: string;
  onChange: (value: string) => void;
};

export function StoryPromptInput({ mode, value, onChange }: StoryPromptInputProps) {
  const heading = mode === "educational" ? "What should we explain?" : "What story should we tell?";
  const helperText =
    mode === "educational"
      ? 'Try prompts like "Explain the solar system to a 5-year-old" or "Teach honesty with a simple story."'
      : 'Try prompts like "A child in a forest who finds a talking parrot" or "A moonlit kite adventure."';

  return (
    <div className="stack-sm">
      <div>
        <p className="eyebrow">Step 3</p>
        <h2>{heading}</h2>
        <p className="muted-text">{helperText}</p>
      </div>

      <textarea
        className="prompt-input"
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          mode === "educational"
            ? "Explain how ambulances help people in a way a little child can understand."
            : "A little girl in a forest who finds a talking parrot."
        }
        rows={5}
        value={value}
      />
    </div>
  );
}
