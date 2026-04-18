"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChildPicker } from "@/components/create/ChildPicker";
import { GenerateIdeaButton } from "@/components/create/GenerateIdeaButton";
import { StoryModeToggle } from "@/components/create/StoryModeToggle";
import { StoryPromptInput } from "@/components/create/StoryPromptInput";
import { StorySettingsForm } from "@/components/create/StorySettingsForm";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { getChildren } from "@/lib/storage/children";
import { pushRecentStory } from "@/lib/storage/recents";
import { saveGeneratedStory } from "@/lib/storage/stories";
import { getAgeFromDateOfBirth } from "@/lib/utils/date";
import type { ChildProfile } from "@/lib/types/child";
import type { StoryLanguage, StoryMode, StoryRecord, StylePreset, VoicePreset } from "@/lib/types/story";

export default function CreatePage() {
  const router = useRouter();
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
  const [mode, setMode] = useState<StoryMode>("adventure");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<StoryLanguage>("english");
  const [level, setLevel] = useState(4);
  const [stylePreset, setStylePreset] = useState<StylePreset>("storybook-cartoon");
  const [voicePreset, setVoicePreset] = useState<VoicePreset>("warm-parent");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setChildrenProfiles(getChildren());
  }, []);

  const selectedChild = childrenProfiles.find((child) => child.id === selectedChildId);

  async function handleGenerateIdeas() {
    setIsIdeaLoading(true);
    setErrorMessage("");

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
          childContext: selectedChild
            ? {
                name: selectedChild.name,
                nickname: selectedChild.nickname,
                age: getAgeFromDateOfBirth(selectedChild.dateOfBirth),
                city: selectedChild.city,
                country: selectedChild.country,
              }
            : null,
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
          childContext: selectedChild
            ? {
                name: selectedChild.name,
                nickname: selectedChild.nickname,
                age: getAgeFromDateOfBirth(selectedChild.dateOfBirth),
                city: selectedChild.city,
                country: selectedChild.country,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Story generation failed. Please try again.");
      }

      const payload = (await response.json()) as { story: StoryRecord };
      saveGeneratedStory(payload.story);
      pushRecentStory(payload.story.id);
      router.push(`/stories/${payload.story.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Story generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <PageShell>
      <section className="page-title">
        <div>
          <p className="eyebrow">Create story</p>
          <h1>Shape a new family story in one calm flow.</h1>
          <p>
            This version now generates a complete story record locally through our server routes, so you can move from
            prompt to reader without mock placeholders.
          </p>
        </div>
      </section>

      <Card className="panel-card">
        <div className="form-stack">
          <StoryModeToggle value={mode} onChange={setMode} />
          <ChildPicker childrenProfiles={childrenProfiles} onChange={setSelectedChildId} value={selectedChildId} />
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

          <Card className="cta-card">
            <p className="eyebrow">Preview</p>
            <h2>{mode === "adventure" ? "Adventure story" : "Educational story"}</h2>
            <p className="muted-text">
              {selectedChild ? `Personalized gently for ${selectedChild.name}.` : "No child selected. This story will stay general."}
            </p>
            <div className="settings-grid">
              <p>
                <strong>Language</strong>
                <br />
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </p>
              <p>
                <strong>Level</strong>
                <br />
                {level}
              </p>
              <p>
                <strong>Style</strong>
                <br />
                {stylePreset.replaceAll("-", " ")}
              </p>
              <p>
                <strong>Voice</strong>
                <br />
                {voicePreset.replaceAll("-", " ")}
              </p>
            </div>
            {prompt.trim() ? (
              <p className="muted-text">
                <strong>Prompt preview:</strong> {prompt}
              </p>
            ) : null}
            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
            <div className="panel-card__actions">
              <Button disabled={!prompt.trim() || isGenerating} onClick={handleGenerateStory}>
                {isGenerating ? "Generating Story..." : "Generate Story"}
              </Button>
              <Button href="/children" variant="ghost">
                Manage Child Profiles
              </Button>
            </div>
          </Card>
        </div>
      </Card>
    </PageShell>
  );
}
