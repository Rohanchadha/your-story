"use client";

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { StoryRow } from "@/components/home/StoryRow";
import { Button } from "@/components/shared/Button";
import { getFavoriteStories, getGeneratedStories, getRecentStories } from "@/lib/storage/stories";
import { seededStoryRecords } from "@/lib/story/seeded";
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

  const allStories = useMemo(
    () => [...generatedStories, ...seededStoryRecords],
    [generatedStories],
  );

  const stats = useMemo(
    () => [
      { label: "Total stories", value: allStories.length },
      { label: "Your creations", value: generatedStories.length },
      { label: "Recently read", value: recentStories.length },
      { label: "Favorites", value: favoriteStories.length },
    ],
    [allStories.length, favoriteStories.length, generatedStories.length, recentStories.length],
  );

  return (
    <PageShell>
      <section className="page-title">
        <div>
          <p className="eyebrow">Your Library</p>
          <h1>All your stories, one cozy shelf.</h1>
          <p className="muted-text">Browse stories you've created, pick up where you left off, or revisit family favorites.</p>
        </div>
        <Button href="/create">✨ Create a new story</Button>
      </section>

      <section className="dashboard-grid dashboard-grid--4">
        {stats.map((stat) => (
          <article className="dashboard-stat" key={stat.label}>
            <p className="eyebrow">{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      {generatedStories.length > 0 && (
        <StoryRow eyebrow="Your creations" title="Stories you brought to life." stories={generatedStories} />
      )}

      <StoryRow eyebrow="Pre-built collection" title="Handcrafted stories ready to enjoy." stories={seededStoryRecords} />

      {recentStories.length > 0 && (
        <StoryRow eyebrow="Recently read" title="Pick up where you left off." stories={recentStories} />
      )}

      {favoriteStories.length > 0 && (
        <StoryRow eyebrow="Favorites" title="Stories your family loves most." stories={favoriteStories} />
      )}

      {generatedStories.length === 0 && (
        <section className="empty-state">
          <p className="eyebrow">No custom stories yet</p>
          <h2>Your first story is just a prompt away.</h2>
          <p className="muted-text">Create a story and it will appear right here in your personal library.</p>
          <div className="hero-section__actions">
            <Button href="/create">Create a story</Button>
            <Button href="/" variant="secondary">
              Browse home
            </Button>
          </div>
        </section>
      )}
    </PageShell>
  );
}
