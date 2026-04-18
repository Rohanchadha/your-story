import { Button } from "@/components/shared/Button";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__copy">
        <p className="eyebrow">Premium storytelling for modern families</p>
        <h1>Stories that feel hand-crafted for your child, even on your busiest days.</h1>
        <p className="hero-section__body">
          Create narrated comic stories, explain big ideas simply, and print beautiful panels for screen-light story
          time.
        </p>
        <div className="hero-section__actions">
          <Button href="/create">Create a Story</Button>
          <Button href="/favorites" variant="secondary">
            Explore Favorites
          </Button>
        </div>
        <div className="hero-section__chips" aria-label="Quick shortcuts">
          <span>Adventure</span>
          <span>Learn Something</span>
          <span>Hindi</span>
          <span>Levels 1-10</span>
        </div>
      </div>

      <div className="hero-section__panel">
        <div className="hero-bubble">
          <strong>Tonight's gentle mix</strong>
          <p>1 curious bedtime story, 1 solar system explainer, and 1 printable comic layout.</p>
        </div>
        <div className="hero-poster">
          <span>Story of the Day</span>
          <h2>The Sunbeam Train</h2>
          <p>A golden little engine helps planets stay on their sparkling paths.</p>
        </div>
      </div>
    </section>
  );
}
