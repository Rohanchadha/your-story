export type StoryMode = "adventure" | "educational" | "math" | "science" | "history";

export type StoryLanguage =
  | "english"
  | "hindi"
  | "tamil"
  | "telugu"
  | "marathi"
  | "bengali"
  | "kannada"
  | "punjabi"
  | "urdu";

export type StylePreset =
  | "storybook-cartoon"
  | "cozy-anime"
  | "minimal-pastel"
  | "soft-watercolor"
  | "playful-pencil";

export type VoicePreset =
  | "warm-parent"
  | "playful-friend"
  | "gentle-grandma"
  | "curious-explorer";

export type StoryStatus = "draft" | "generating" | "partial" | "ready" | "failed";

export type StorySummary = {
  id: string;
  title: string;
  summary: string;
  category: string;
  level: number;
  language: StoryLanguage;
  mode: StoryMode;
  stylePreset: StylePreset;
  voicePreset: VoicePreset;
  coverAccent: string;
  coverImageUrl?: string;
  isFavorite?: boolean;
};

export type ChildSnapshot = {
  name: string;
  nickname?: string;
  age?: number | null;
  city?: string;
  country?: string;
};

export type StoryPanel = {
  id: string;
  title: string;
  panelText: string;
  narrationText: string;
  imagePrompt: string;
  imageUrl?: string;
  status: "pending" | "ready" | "failed";
};

export type StoryRecord = StorySummary & {
  prompt: string;
  fullText: string;
  narrationAudioUrl?: string;
  narrationVoicePreset?: VoicePreset;
  childSnapshot?: ChildSnapshot | null;
  panels: StoryPanel[];
  origin: "seeded" | "generated";
  createdAt: string;
  updatedAt: string;
  status: StoryStatus;
};

export type StoryIdeaRequest = {
  mode: StoryMode;
  language: StoryLanguage;
  level: number;
  childContext?: ChildSnapshot | null;
};

export type StoryGenerateRequest = StoryIdeaRequest & {
  prompt: string;
  stylePreset: StylePreset;
  voicePreset: VoicePreset;
};
