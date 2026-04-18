export type GenerationStage =
  | "validating"
  | "writing"
  | "panelizing"
  | "illustrating"
  | "narrating"
  | "finalizing";

export type GenerationJob = {
  id: string;
  storyId: string;
  stage: GenerationStage;
  status: "pending" | "running" | "ready" | "failed";
  errorMessage?: string;
  updatedAt: string;
};
