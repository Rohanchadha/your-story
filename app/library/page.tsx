"use client";

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { StoryRow } from "@/components/home/StoryRow";
import { Button } from "@/components/shared/Button";
import { getFavoriteStories, getGeneratedStories, getRecentStories } from "@/lib/storage/stories";
import type { StoryRecord } from "@/lib/types/story";

export default function LibraryPage() {
  const [generatedStories, setGeneratedStories] = useState<StoryRecord[]>([]);
  const [recentStories, setRecentStories] = useState<StoryRecord[]>([]);
  const [favoriteStories, setFavoriteStories] = useState<StoryRecord[]>([]);

  useEffect(() => {
    setGeneratedStories(getGeneratedStories());
    setRecentStories(getRecentStories());
    setFavoriteStories(getFavoriteStories());
  }, []);

  const stats = useMemo(
    () => [
      { label: "Generated stories", value: generatedStories.length },
      { label: "Recent reads", value: recentStories.length },
      { label: "Favorites", value: favoriteStories.length },
    ],
    [favoriteStories.length, generatedStories.length, recentStories.length],
  );

  return (
    <PageShell>
      <section className="page-title">
        <div>
          <p className="eyebrow">Library</p>
          <h1>Your generated story dashboard is now a real place.</h1>
          <p>Use this view to revisit newly created stories, track what has been read recently, and jump back into favorites.</p>
        </div>
        <Button href="/create">Create another story</Button>
      </section>

      <section className="dashboard-grid">
        {stats.map((stat) => (
          <article className="dashboard-stat" key={stat.label}>
            <p className="eyebrow">{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      {generatedStories.length > 0 ? (
        <StoryRow eyebrow="Generated stories" title="Freshly created stories from this browser." stories={generatedStories} />
      ) : (
        <section className="empty-state">
          <p className="eyebrow">No generated stories yet</p>
          <h2>Your custom stories will start showing up here after the first creation flow.</h2>
          <div className="hero-section__actions">
            <Button href="/create">Create a story</Button>
            <Button href="/" variant="secondary">
              Explore home
            </Button>
          </div>
        </section>
      )}

      {recentStories.length > 0 ? (
        <StoryRow eyebrow="Recent reads" title="Stories opened most recently in this browser." stories={recentStories} />
      ) : null}

      {favoriteStories.length > 0 ? (
        <StoryRow eyebrow="Favorites" title="Saved stories worth coming back to." stories={favoriteStories} />
      ) : null}
    </PageShell>
  );
}
