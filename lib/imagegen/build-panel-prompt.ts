import type { StoryMode, StoryPanel, StylePreset } from "@/lib/types/story";

const styleNotes: Record<StylePreset, string> = {
  "storybook-cartoon": "rounded shapes, expressive faces, bold storybook composition",
  "cozy-anime": "whimsical cozy anime mood, gentle cinematic framing, soft atmosphere",
  "minimal-pastel": "minimal composition, pastel palette, simple readable shapes",
  "soft-watercolor": "watercolor textures, calm brushwork, dreamy bedtime softness",
  "playful-pencil": "hand-drawn pencil lines, playful texture, cheerful sketchbook feeling",
};

export function buildPanelPrompt(panel: Pick<StoryPanel, "title" | "panelText">, stylePreset: StylePreset, mode: StoryMode): string {
  const modeNote =
    mode === "educational"
      ? "Clear educational storytelling image that helps a child understand the concept visually."
      : "Warm adventure storytelling image with emotional clarity and a sense of discovery.";

  return [
    "Use case: illustration-story",
    "Asset type: comic story panel for a children's storytelling web app",
    `Primary request: illustrate the scene "${panel.title}" for a children's story panel`,
    `Scene/backdrop: ${panel.panelText}`,
    `Style/medium: children's illustration, ${styleNotes[stylePreset]}`,
    "Composition/framing: readable panel composition with one clear focal point and room for printed text below",
    "Lighting/mood: warm, safe, inviting, child-friendly",
    "Color palette: soft premium child-friendly tones",
    `Constraints: ${modeNote} no text, no watermark, no frightening imagery`,
    "Avoid: clutter, horror elements, distorted anatomy, extra limbs, chaotic backgrounds",
  ].join("\n");
}
