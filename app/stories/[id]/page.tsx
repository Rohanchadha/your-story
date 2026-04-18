"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { NarrationBar } from "@/components/story-reader/NarrationBar";
import { Button } from "@/components/shared/Button";
import { getFavoriteStoryIds, toggleFavoriteStory } from "@/lib/storage/favorites";
import { pushRecentStory } from "@/lib/storage/recents";
import { getStoryById, persistStoryCoverImage, persistStoryNarrationAudio, persistStoryPanelImages } from "@/lib/storage/stories";
import type { StoryRecord } from "@/lib/types/story";

function FavoriteIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg aria-hidden="true" className="story-cta__icon" viewBox="0 0 24 24">
      <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="story-cta__icon" viewBox="0 0 24 24">
      <path d="m12 20.1-1.45-1.32C5.4 14.11 2 11.03 2 7.25 2 4.17 4.42 1.75 7.5 1.75c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.53L12 20.1Zm0-2.44c4.39-4 7.25-6.6 7.25-9.33 0-2.01-1.49-3.5-3.5-3.5-1.37 0-2.68.81-3.24 2.05h-1.02C11.17 5.64 9.86 4.83 8.49 4.83c-2.01 0-3.5 1.49-3.5 3.5 0 2.73 2.86 5.33 7.01 9.33Z" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg aria-hidden="true" className="story-cta__icon" viewBox="0 0 24 24">
      <path d="M7 8V3h10v5H7Zm8-2V5H9v1h6Zm2 12h-2v4H9v-4H7a3 3 0 0 1-3-3v-4.5A2.5 2.5 0 0 1 6.5 8h11A2.5 2.5 0 0 1 20 10.5V15a3 3 0 0 1-3 3Zm-4 2v-4h-2v4h2Zm4-10H6.5a.5.5 0 0 0-.5.5V15a1 1 0 0 0 1 1h1v-2h8v2h1a1 1 0 0 0 1-1v-4.5a.5.5 0 0 0-.5-.5Z" />
    </svg>
  );
}

export default function StoryPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryRecord | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artStatusMessage, setArtStatusMessage] = useState("");

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
                storyId: story.id,
                panelId: panel.id,
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
      const firstImage = nextPanels.find((panel) => panel.imageUrl)?.imageUrl;
      if (firstImage) {
        persistStoryCoverImage(story.id, firstImage);
      }

      setStory(
        persisted ?? {
          ...story,
          coverImageUrl: firstImage ?? story.coverImageUrl,
          panels: nextPanels,
        },
      );
      setArtStatusMessage("Artwork saved locally for this story.");
    } finally {
      setIsGeneratingArt(false);
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
        <div className="story-reader__actions">
          <Button
            className={["story-cta", isFavorite ? "story-cta--active" : ""].filter(Boolean).join(" ")}
            onClick={handleFavoriteToggle}
            variant="secondary"
          >
            <FavoriteIcon filled={isFavorite} />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </Button>
          <Button className="story-cta story-cta--print" href={`/stories/${story.id}/print`} variant="secondary">
            <PrintIcon />
            <span>Print Story</span>
          </Button>
        </div>
      </section>

      <NarrationBar
        story={story}
        onNarrationReady={(audioUrl, voicePreset) => {
          const persisted = persistStoryNarrationAudio(story.id, audioUrl, voicePreset);
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
        {story.panels.map((panel) => (
          <article className="reader-panel" key={panel.id}>
            <div className="reader-panel__art" style={{ background: story.coverAccent }}>
              {panel.imageUrl ? <img alt={panel.title} className="reader-panel__image" src={panel.imageUrl} /> : null}
            </div>
            <div className="reader-panel__body">
              <h2>{panel.title}</h2>
              <p>{panel.panelText}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <p className="eyebrow">Full story text</p>
        <h2>Read it straight through</h2>
        <div className="full-story-text">
          {story.panels.map((panel) => (
            <p key={`full-${panel.id}`}>{panel.panelText}</p>
          ))}
        </div>
        <div className="panel-card__actions panel-card__actions--spaced">
          <Button href="/create">Create another story</Button>
          <Button href="/" variant="secondary">
            Return home
          </Button>
        </div>
      </section>

      {(!story.panels.every((panel) => panel.imageUrl) || isGeneratingArt || artStatusMessage) && (
        <section className="panel-card">
          <p className="eyebrow">Scene artwork</p>
          <h2>Illustrations</h2>
          <p className="muted-text">
            Generate brand-new artwork for every scene at once. Saved images load instantly the next time you open the
            story.
          </p>
          {artStatusMessage ? <p className="media-status">{artStatusMessage}</p> : null}
          <div className="panel-card__actions">
            <Button onClick={handleGenerateArtwork} disabled={isGeneratingArt}>
              {isGeneratingArt
                ? "Generating artwork..."
                : story.panels.some((panel) => panel.imageUrl)
                  ? "Regenerate all panel art"
                  : "Generate all panel art"}
            </Button>
          </div>
        </section>
      )}
    </PageShell>
  );
}
