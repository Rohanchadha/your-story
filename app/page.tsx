"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { StoryRow } from "@/components/home/StoryRow";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { homeCategories } from "@/lib/constants/story-config";
import { getFavoriteStories, getRecentStories } from "@/lib/storage/stories";
import { getStoryOfTheDay, seededStories } from "@/lib/story/seeded";
import type { StoryRecord, StorySummary } from "@/lib/types/story";

export default function HomePage() {
  const storyOfTheDay = getStoryOfTheDay();
  const [recentStories, setRecentStories] = useState<Array<StorySummary | StoryRecord>>(seededStories.slice(1, 4));
  const [favoriteStories, setFavoriteStories] = useState<Array<StorySummary | StoryRecord>>(seededStories.slice(0, 3));

  useEffect(() => {
    const recents = getRecentStories();
    const favorites = getFavoriteStories();

    if (recents.length > 0) {
      setRecentStories(recents);
    }

    if (favorites.length > 0) {
      setFavoriteStories(favorites);
    }
  }, []);

  return (
    <PageShell>
      <HeroSection />

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Story of the day</p>
            <h2>{storyOfTheDay.title}</h2>
          </div>
          <Button href={`/stories/${storyOfTheDay.id}`} variant="secondary">
            Open Story
          </Button>
        </div>
        <p className="muted-text">{storyOfTheDay.summary}</p>
      </section>

      <CategoryGrid categories={homeCategories} />

      <StoryRow eyebrow="Recent stories" title="Jump back into the stories your family opened most recently." stories={recentStories} />

      <StoryRow eyebrow="Favorite stories" title="Keep your most-loved adventures and explainers close by." stories={favoriteStories} />

      <section className="cta-grid">
        <Card className="cta-card">
          <p className="eyebrow">Bring your personal memories to life</p>
          <h2>Photo-to-story is on the roadmap.</h2>
          <p className="muted-text">
            We'll keep this visible in the MVP so the promise is clear, while the live product focuses on story and
            learning flows first.
          </p>
          <Button href="/create" variant="ghost">
            Explore story creation
          </Button>
        </Card>

        <Card className="cta-card">
          <p className="eyebrow">Teach complex concepts</p>
          <h2>Start with solar systems, ambulances, cars, rain, and plants.</h2>
          <p className="muted-text">Educational mode turns tough concepts into calm, visual stories for little minds.</p>
          <Button href="/create">Start an Educational Story</Button>
        </Card>
      </section>
    </PageShell>
  );
}
