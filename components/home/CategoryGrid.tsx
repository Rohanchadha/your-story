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
          <div className="category-pill" key={category}>
            {category}
          </div>
        ))}
      </div>
    </section>
  );
}
