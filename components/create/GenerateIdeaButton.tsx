"use client";

import { Button } from "@/components/shared/Button";
import type { StoryMode } from "@/lib/types/story";

type GenerateIdeaButtonProps = {
  mode: StoryMode;
  ideas: string[];
  isLoading: boolean;
  onGenerate: () => void;
  onChoose: (value: string) => void;
};

export function GenerateIdeaButton({ mode, ideas, isLoading, onGenerate, onChoose }: GenerateIdeaButtonProps) {
  return (
    <div className="stack-xs">
      <Button onClick={onGenerate} variant="secondary">
        {isLoading ? "Generating ideas..." : `Generate ${mode === "educational" ? "Learning" : "Story"} Ideas`}
      </Button>
      <div className="suggestion-row">
        {ideas.map((idea) => (
          <button className="suggestion-pill" key={idea} onClick={() => onChoose(idea)} type="button">
            {idea}
          </button>
        ))}
      </div>
    </div>
  );
}
