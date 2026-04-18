"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { NarrationBar } from "@/components/story-reader/NarrationBar";
import { Button } from "@/components/shared/Button";
import { getFavoriteStoryIds, toggleFavoriteStory } from "@/lib/storage/favorites";
import { pushRecentStory } from "@/lib/storage/recents";
import { getStoryById, persistStoryNarrationAudio, persistStoryPanelImages } from "@/lib/storage/stories";
import type { StoryRecord } from "@/lib/types/story";

export default function StoryPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryRecord | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artStatusMessage, setArtStatusMessage] = useState("");
  const [panelLoading, setPanelLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!params.id) return;

    const nextStory = getStoryById(params.id);
    setStory(nextStory ?? null);
    setIsFavorite(getFavoriteStoryIds().includes(params.id));
    if (nextStory) {
      pushRecentStory(params.id);
    }
  }, [params.id]);

  const metadataLabel = useMemo(() => {
    if (!story) return "";
    return `${story.category} - Level ${story.level} - ${story.language}`;
  }, [story]);

  function handleFavoriteToggle() {
    if (!story) return;
    const nextFavorites = toggleFavoriteStory(story.id);
    setIsFavorite(nextFavorites.includes(story.id));
  }

  async function handleGenerateArtwork() {
    if (!story) return;

    setIsGeneratingArt(true);
    setArtStatusMessage("");

    try {
      const nextPanels = await Promise.all(
        story.panels.map(async (panel) => {
          try {
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
              return panel;
            }

            const payload = (await response.json()) as { imageUrl: string };
            return {
              ...panel,
              imageUrl: payload.imageUrl,
            };
          } catch {
            return panel;
          }
        }),
      );

      const persisted = persistStoryPanelImages(
        story.id,
        Object.fromEntries(nextPanels.filter((panel) => panel.imageUrl).map((panel) => [panel.id, panel.imageUrl as string])),
      );

      setStory(
        persisted ?? {
          ...story,
          panels: nextPanels,
        },
      );
      setArtStatusMessage("Artwork saved locally for this story.");
    } finally {
      setIsGeneratingArt(false);
    }
  }

  async function handleGenerateSinglePanel(panelId: string) {
    if (!story) return;

    const panel = story.panels.find((item) => item.id === panelId);
    if (!panel) return;

    setPanelLoading((current) => ({ ...current, [panelId]: true }));
    setArtStatusMessage("");

    try {
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
        setArtStatusMessage("That panel could not be generated just now. Please retry.");
        return;
      }

      const payload = (await response.json()) as { imageUrl: string };
      const persisted = persistStoryPanelImages(story.id, { [panelId]: payload.imageUrl });
      setStory(
        persisted ?? {
          ...story,
          panels: story.panels.map((item) => (item.id === panelId ? { ...item, imageUrl: payload.imageUrl } : item)),
        },
      );
      setArtStatusMessage("Panel artwork saved locally.");
    } finally {
      setPanelLoading((current) => ({ ...current, [panelId]: false }));
    }
  }

  if (!story) {
    return (
      <PageShell>
        <section className="empty-state">
          <p className="eyebrow">Story not found</p>
          <h2>We couldn't find that story in local storage or the seeded library.</h2>
          <div className="hero-section__actions">
            <Button href="/create">Create a Story</Button>
            <Button href="/" variant="secondary">
              Back Home
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="reader-header">
        <div>
          <p className="eyebrow">Story reader</p>
          <h1>{story.title}</h1>
          <p className="muted-text">{story.summary}</p>
          <p className="reader-meta">{metadataLabel}</p>
        </div>
        {story.coverImageUrl ? <img alt={`${story.title} cover`} className="reader-cover" src={story.coverImageUrl} /> : null}
        <div className="hero-section__actions">
          <Button onClick={handleFavoriteToggle} variant={isFavorite ? "secondary" : "ghost"}>
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>
          <Button onClick={handleGenerateArtwork} variant="secondary">
            {isGeneratingArt ? "Generating AI Art..." : "Generate AI Artwork"}
          </Button>
          <Button href={`/stories/${story.id}/print`} variant="secondary">
            Print Story
          </Button>
        </div>
      </section>

      <NarrationBar
        story={story}
        onNarrationReady={(audioUrl) => {
          const persisted = persistStoryNarrationAudio(story.id, audioUrl);
          if (persisted) {
            setStory(persisted);
          }
        }}
      />
      {artStatusMessage ? (
        <section className="panel-card media-banner">
          <p className="media-status">{artStatusMessage}</p>
        </section>
      ) : null}

      <section className="reader-grid">
        {story.panels.map((panel, index) => (
          <article className="reader-panel" key={panel.id}>
            <div className="reader-panel__art" style={{ background: story.coverAccent }}>
              {panel.imageUrl ? <img alt={panel.title} className="reader-panel__image" src={panel.imageUrl} /> : null}
              <div className="reader-panel__badge">
                <span>Panel {index + 1}</span>
                <strong>{panel.title}</strong>
              </div>
            </div>
            <div className="reader-panel__body">
              <p className="eyebrow">Scene text</p>
              <h2>{panel.title}</h2>
              <p>{panel.panelText}</p>
              <details className="prompt-details">
                <summary>Illustration prompt</summary>
                <p className="muted-text">{panel.imagePrompt}</p>
              </details>
              <div className="panel-card__actions">
                <Button onClick={() => handleGenerateSinglePanel(panel.id)} variant="ghost">
                  {panelLoading[panel.id] ? "Generating panel..." : panel.imageUrl ? "Regenerate panel art" : "Generate panel art"}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <p className="eyebrow">Full story text</p>
        <h2>Read it straight through</h2>
        <p>{story.fullText}</p>
        <div className="panel-card__actions">
          <Link className="section-link" href="/create">
            Create another story
          </Link>
          <Link className="section-link" href="/">
            Return home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
