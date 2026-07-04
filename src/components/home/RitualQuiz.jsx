import { useEffect, useState } from 'react';
import Container from '../common/Container.jsx';
import ProductCard from '../common/ProductCard.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { fallback, publicApi } from '../../services/api.js';

const quizOptions = [
  { label: 'Calm', value: 'Calm' },
  { label: 'Focus', value: 'Focus' },
  { label: 'Prayer', value: 'Prayer' },
  { label: 'Freshness', value: 'Freshness' },
  { label: 'Sleep', value: 'Sleep' },
  { label: 'Gifting', value: 'Gifting' },
];

export default function RitualQuiz() {
  const [selected, setSelected] = useState(quizOptions[0]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.getProductsByMood(selected.value)
      .then((products) => setMatches(products.slice(0, 6)))
      .catch(() => {
        const fallbackMood = selected.value === 'Freshness' ? 'Fresh' : selected.value;
        setMatches(fallback.products.filter((product) => product.moodTags.includes(fallbackMood)).slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <section className="py-16">
      <Container>
        <div className="rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-lift md:p-10">
          <SectionHeading title="Find Your Ritual" subtitle="What do you need today?" />
          <div className="flex flex-wrap justify-center gap-3">
            {quizOptions.map((option) => (
              <button key={option.value} className={`focus-ring rounded-full border px-5 py-3 text-sm font-semibold transition ${selected.value === option.value ? 'border-ritual-gold bg-ritual-gold text-white' : 'border-ritual-border bg-ritual-background text-ritual-text hover:border-ritual-gold'}`} onClick={() => setSelected(option)}>
                {option.label}
              </button>
            ))}
          </div>
          <h3 className="mt-10 text-center font-serif text-2xl">Your ritual match</h3>
          {loading ? <div className="mt-6 grid gap-6 md:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-lg bg-ritual-border/60" />)}</div> : null}
          {!loading && matches.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {matches.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : null}
          {!loading && !matches.length ? (
            <div className="mt-6 rounded-lg border border-ritual-border bg-ritual-background p-8 text-center text-ritual-muted">
              No recommendations are active for this mood yet.
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
