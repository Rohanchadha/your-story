import type { StoryLanguage, StoryMode, StylePreset, VoicePreset } from "@/lib/types/story";

export const storyModes: Array<{ value: StoryMode; label: string; description: string }> = [
  {
    value: "adventure",
    label: "Adventure Story",
    description: "Wonder-filled tales with heart, humor, and a cozy ending.",
  },
  {
    value: "educational",
    label: "Educational Story",
    description: "Complex ideas explained gently through playful storytelling.",
  },
];

export const supportedLanguages: Array<{ value: StoryLanguage; label: string }> = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "marathi", label: "Marathi" },
  { value: "bengali", label: "Bengali" },
  { value: "kannada", label: "Kannada" },
  { value: "punjabi", label: "Punjabi" },
  { value: "urdu", label: "Urdu" },
];

export const stylePresets: Array<{ value: StylePreset; label: string; blurb: string }> = [
  {
    value: "storybook-cartoon",
    label: "Storybook Cartoon",
    blurb: "Warm comic panels with rounded shapes and expressive scenes.",
  },
  {
    value: "cozy-anime",
    label: "Cozy Anime",
    blurb: "Dreamy, whimsical frames with bright-eyed characters and soft motion.",
  },
  {
    value: "minimal-pastel",
    label: "Minimal Pastel",
    blurb: "Clean scenes with calming colors and simple silhouettes.",
  },
  {
    value: "soft-watercolor",
    label: "Soft Watercolor",
    blurb: "Painterly washes, gentle textures, and quiet bedtime warmth.",
  },
  {
    value: "playful-pencil",
    label: "Playful Pencil",
    blurb: "Hand-drawn charm with sketchy lines and cheerful details.",
  },
];

export const voicePresets: Array<{ value: VoicePreset; label: string; blurb: string }> = [
  {
    value: "warm-parent",
    label: "Warm Parent",
    blurb: "Soft, reassuring, and perfect for winding down.",
  },
  {
    value: "playful-friend",
    label: "Playful Friend",
    blurb: "Energetic and bright for giggles and active listening.",
  },
  {
    value: "gentle-grandma",
    label: "Gentle Grandma",
    blurb: "Cozy, patient narration with a storytime feel.",
  },
  {
    value: "curious-explorer",
    label: "Curious Explorer",
    blurb: "Expressive and upbeat for learning new ideas together.",
  },
];

export const homeCategories = [
  "Math Stories",
  "Science Stories",
  "History Stories",
  "Honesty",
  "Empathy",
  "Being Helpful",
  "Bedtime",
  "Adventure",
];
