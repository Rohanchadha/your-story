import { StoryCard } from "@/components/shared/StoryCard";
import type { StorySummary } from "@/lib/types/story";

type StoryRowProps = {
  eyebrow: string;
  title: string;
  stories: StorySummary[];
};

export function StoryRow({ eyebrow, title, stories }: StoryRowProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="story-grid">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
