"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { StoryRow } from "@/components/home/StoryRow";
import { getFavoriteStories } from "@/lib/storage/stories";
import type { StoryRecord } from "@/lib/types/story";

export default function FavoritesPage() {
  const [favoriteStories, setFavoriteStories] = useState<StoryRecord[]>([]);

  useEffect(() => {
    setFavoriteStories(getFavoriteStories());
  }, []);

  return (
    <PageShell>
      <section className="page-title">
        <div>
          <p className="eyebrow">Favorites</p>
          <h1>Your saved family library lives here now.</h1>
          <p>Favorites are stored locally in the browser for this demo, so you can keep the stories you want to revisit.</p>
        </div>
      </section>

      {favoriteStories.length > 0 ? (
        <StoryRow eyebrow="Favorite stories" title="Stories worth replaying, re-reading, and printing." stories={favoriteStories} />
      ) : (
        <section className="empty-state">
          <p className="eyebrow">No favorites yet</p>
          <h2>Open any story and tap Favorite to start your library.</h2>
          <p className="muted-text">Seeded stories and newly generated ones can both be saved here.</p>
        </section>
      )}
    </PageShell>
  );
}
