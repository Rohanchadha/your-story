import Link from "next/link";

type CategoryGridProps = {
  categories: string[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Popular categories</p>
          <h2>Pick a mood, value, or concept to begin.</h2>
        </div>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <Link
            className="category-pill category-pill--link"
            key={category}
            href={`/create?category=${encodeURIComponent(category)}`}
          >
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}
