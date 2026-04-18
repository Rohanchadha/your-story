"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GenerateIdeaButton } from "@/components/create/GenerateIdeaButton";
import { StoryModeToggle } from "@/components/create/StoryModeToggle";
import { StoryPromptInput } from "@/components/create/StoryPromptInput";
import { StorySettingsForm } from "@/components/create/StorySettingsForm";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/shared/Button";
import { stylePresets, supportedLanguages, voicePresets } from "@/lib/constants/story-config";
import { pushRecentStory } from "@/lib/storage/recents";
import { persistStoryCoverImage, persistStoryPanelImages, saveGeneratedStory } from "@/lib/storage/stories";
import type { StoryLanguage, StoryMode, StoryRecord, StylePreset, VoicePreset } from "@/lib/types/story";

type ImagePayload = {
  imageUrl: string;
};

const writingMessages = [
  "Sketching the story arc...",
  "Finding a warm opening scene...",
  "Shaping age-appropriate language...",
  "Polishing the comic panel beats...",
];

const illustratingMessages = [
  "Painting the story panels...",
  "Adding character warmth and color...",
  "Composing the first comic scenes...",
  "Saving artwork for instant replays...",
];

async function generateArtworkForStory(story: StoryRecord): Promise<StoryRecord> {
  const panelImages: Record<string, string> = {};

  for (const panel of story.panels) {
    const response = await fetch("/api/media/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: panel.imagePrompt,
      }),
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as ImagePayload;
    panelImages[panel.id] = payload.imageUrl;
  }

  const nextStory = {
    ...story,
    coverImageUrl: Object.values(panelImages)[0] ?? story.coverImageUrl,
    panels: story.panels.map((panel) => ({
      ...panel,
      imageUrl: panelImages[panel.id] ?? panel.imageUrl,
    })),
  };

  const persistedPanels = Object.keys(panelImages).length ? persistStoryPanelImages(story.id, panelImages) : undefined;
  if (Object.values(panelImages)[0]) {
    persistStoryCoverImage(story.id, Object.values(panelImages)[0]);
  }

  return persistedPanels
    ? {
        ...persistedPanels,
        coverImageUrl: Object.values(panelImages)[0] ?? persistedPanels.coverImageUrl,
      }
    : nextStory;
}

export default function CreatePage() {
  const router = useRouter();
  const [mode, setMode] = useState<StoryMode>("adventure");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<StoryLanguage>("english");
  const [level, setLevel] = useState(4);
  const [stylePreset, setStylePreset] = useState<StylePreset>("storybook-cartoon");
  const [voicePreset, setVoicePreset] = useState<VoicePreset>("warm-parent");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isArtworkGenerating, setIsArtworkGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [generationPhase, setGenerationPhase] = useState<"idle" | "writing" | "illustrating">("idle");
  const [generationMessageIndex, setGenerationMessageIndex] = useState(0);

  const selectedStyle = stylePresets.find((item) => item.value === stylePreset);
  const selectedVoice = voicePresets.find((item) => item.value === voicePreset);
  const selectedLanguage = supportedLanguages.find((item) => item.value === language);

  useEffect(() => {
    if (generationPhase === "idle") {
      setStatusMessage("");
      setGenerationMessageIndex(0);
      return;
    }

    const messages = generationPhase === "writing" ? writingMessages : illustratingMessages;
    setStatusMessage(messages[generationMessageIndex % messages.length] ?? "");

    const interval = window.setInterval(() => {
      setGenerationMessageIndex((current) => current + 1);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [generationPhase, generationMessageIndex]);

  async function handleGenerateIdeas() {
    setIsIdeaLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/stories/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          language,
          level,
          childContext: null,
        }),
      });

      if (!response.ok) {
        throw new Error("We couldn't create ideas right now.");
      }

      const payload = (await response.json()) as { ideas: string[] };
      setIdeas(payload.ideas);
      if (!prompt.trim() && payload.ideas[0]) {
        setPrompt(payload.ideas[0]);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't create ideas right now.");
    } finally {
      setIsIdeaLoading(false);
    }
  }

  async function handleGenerateStory() {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage("");
    setGenerationPhase("writing");
    setGenerationMessageIndex(0);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          mode,
          language,
          level,
          stylePreset,
          voicePreset,
          childContext: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Story generation failed. Please try again.");
      }

      const payload = (await response.json()) as { story: StoryRecord };
      const savedStory = saveGeneratedStory(payload.story);
      setGenerationPhase("illustrating");
      setGenerationMessageIndex(0);
      setIsArtworkGenerating(true);

      const storyWithArt = await generateArtworkForStory(savedStory);
      saveGeneratedStory(storyWithArt);
      pushRecentStory(storyWithArt.id);
      router.push(`/stories/${storyWithArt.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Story generation failed. Please try again.");
      setGenerationPhase("idle");
    } finally {
      setIsGenerating(false);
      setIsArtworkGenerating(false);
      setGenerationPhase("idle");
    }
  }

  return (
    <PageShell>
      <section className="create-stage">
        <div className="create-stage__intro">
          <p className="eyebrow">Create story</p>
          <h1>Build a premium bedtime comic in one smooth pass.</h1>
          <p>
            Start with a spark, choose the visual world, and we&apos;ll generate the story text and artwork together so
            the reader opens feeling complete.
          </p>
          <div className="hero-section__chips">
            <span>300-400 words</span>
            <span>Age-aware storytelling</span>
            <span>Illustrated comic panels</span>
            <span>Printable later</span>
          </div>
        </div>

        <aside className="create-stage__summary">
          <p className="eyebrow">Live preview</p>
          <div className="create-stage__poster" data-style={stylePreset}>
            <span>{mode === "educational" ? "Learning Story" : "Adventure Story"}</span>
            <strong>{prompt.trim() || "Your next magical family story"}</strong>
            <p>
              {selectedStyle?.label} in {selectedLanguage?.label}, tuned for level {level}.
            </p>
          </div>
          <div className="create-stage__meta">
            <p>
              <strong>Illustration</strong>
              <br />
              {selectedStyle?.label}
            </p>
            <p>
              <strong>Narration</strong>
              <br />
              {selectedVoice?.label}
            </p>
          </div>
        </aside>
      </section>

      <section className="create-grid">
        <div className="panel-card create-flow">
          <div className="form-stack">
            <StoryModeToggle value={mode} onChange={setMode} />
            <StoryPromptInput mode={mode} onChange={setPrompt} value={prompt} />
            <GenerateIdeaButton
              ideas={ideas}
              isLoading={isIdeaLoading}
              mode={mode}
              onChoose={setPrompt}
              onGenerate={handleGenerateIdeas}
            />
            <StorySettingsForm
              language={language}
              level={level}
              onLanguageChange={setLanguage}
              onLevelChange={setLevel}
              onStylePresetChange={setStylePreset}
              onVoicePresetChange={setVoicePreset}
              stylePreset={stylePreset}
              voicePreset={voicePreset}
            />
          </div>
        </div>

        <div className="panel-card create-preview-panel">
          <p className="eyebrow">Story setup</p>
          <h2>{mode === "adventure" ? "Adventure story" : "Educational story"}</h2>
          <p className="muted-text">
            The story opens with generated illustrations, so parents land straight in a finished storytelling
            experience instead of empty scenes.
          </p>
          <div className="settings-grid">
            <p>
              <strong>Language</strong>
              <br />
              {selectedLanguage?.label}
            </p>
            <p>
              <strong>Level</strong>
              <br />
              {level}
            </p>
            <p>
              <strong>Style</strong>
              <br />
              {selectedStyle?.label}
            </p>
            <p>
              <strong>Voice</strong>
              <br />
              {selectedVoice?.label}
            </p>
          </div>
          {prompt.trim() ? (
            <div className="create-preview-note">
              <p className="eyebrow">Prompt preview</p>
              <p>{prompt}</p>
            </div>
          ) : null}
          {statusMessage ? <p className="media-status">{statusMessage}</p> : null}
          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
          <div className="panel-card__actions">
            <Button disabled={!prompt.trim() || isGenerating || isArtworkGenerating} onClick={handleGenerateStory}>
              {isGenerating || isArtworkGenerating ? "Generating Story..." : "Generate Story"}
            </Button>
            <Button href="/library" variant="ghost">
              Browse existing stories
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
