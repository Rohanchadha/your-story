import Link from "next/link";
import { Card } from "@/components/shared/Card";
import type { StorySummary } from "@/lib/types/story";

type StoryCardProps = {
  story: StorySummary;
};

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link aria-label={`Open ${story.title}`} className="story-card__link" href={`/stories/${story.id}`}>
      <Card className="story-card">
        <div className="story-card__cover" style={{ background: story.coverAccent }}>
          <div className="story-card__cover-frame">
            {story.coverImageUrl ? <img alt={`${story.title} cover`} className="story-card__cover-image" src={story.coverImageUrl} /> : null}
          </div>
          <span>{story.category}</span>
        </div>
        <div className="story-card__body">
          <p className="story-card__meta">
            Level {story.level} - {story.language}
          </p>
          <h3>{story.title}</h3>
          <p>{story.summary}</p>
          <div className="story-card__actions">
            <span>{story.mode === "adventure" ? "Adventure" : "Educational"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
