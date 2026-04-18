"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/shared/Button";
import { getStoryById } from "@/lib/storage/stories";
import type { StoryRecord } from "@/lib/types/story";

export default function PrintPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryRecord | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setStory(getStoryById(params.id) ?? null);
  }, [params.id]);

  if (!story) {
    return (
      <PageShell>
        <section className="empty-state">
          <p className="eyebrow">Print preview unavailable</p>
          <h2>We couldn't load that story for printing.</h2>
          <Button href="/">Back Home</Button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="reader-header">
        <div>
          <p className="eyebrow">Print layout</p>
          <h1>{story.title}</h1>
          <p className="muted-text">A4-friendly preview with one panel block per section.</p>
        </div>
        <Button onClick={() => window.print()} variant="secondary">
          Print Now
        </Button>
      </section>

      <section className="print-stack">
        {story.panels.map((panel) => (
          <article className="print-card" key={panel.id}>
            <div className="print-card__art" style={{ background: story.coverAccent }}>
              {panel.imageUrl ? <img alt={panel.title} className="reader-panel__image" src={panel.imageUrl} /> : null}
              <div className="reader-panel__badge">
                <strong>{panel.title}</strong>
              </div>
            </div>
            <div className="print-card__body">
              <p>{panel.panelText}</p>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
