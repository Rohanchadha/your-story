import Image from "next/image";
import { Button } from "@/components/shared/Button";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__copy">
        <p className="eyebrow">Premium storytelling for modern families</p>
        <h1>Stories that feel hand-crafted for your child, even on your busiest days.</h1>
        <p className="hero-section__body">
          Create narrated comic stories, explain big ideas simply, and print beautiful panels for screen-free story
          time.
        </p>
        <div className="hero-section__actions">
          <Button href="/create">Create a Story</Button>
          <Button href="/favorites" variant="secondary">
            Explore Favorites
          </Button>
        </div>
      </div>

      <div className="hero-section__copy hero-section__copy--image">
        <Image
          src="/images/hero-illustration.svg"
          alt="A parent and child reading a magical storybook together"
          width={560}
          height={480}
          priority
          className="hero-illustration"
        />
      </div>
    </section>
  );
}
