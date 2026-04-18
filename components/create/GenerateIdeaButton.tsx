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
    <div className="stack-xs idea-helper">
      <Button className="button--mini" onClick={onGenerate} variant="ghost">
        {isLoading ? "Generating ideas..." : `Suggest ${mode === "educational" ? "learning" : "story"} ideas`}
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
