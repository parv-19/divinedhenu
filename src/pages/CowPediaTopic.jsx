import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import { cowpediaTopics, getCowpediaTopic } from '../data/cowpediaTopics.js';
import { fallback, publicApi } from '../services/api.js';

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(value));

export default function CowPediaTopic() {
  const { topicSlug } = useParams();
  const topic = getCowpediaTopic(topicSlug);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    publicApi.getBlogs({ section: 'cowpedia', topic: topic.slug, limit: 100 })
      .then((data) => setPosts(data.blogs || []))
      .catch(() => setPosts(fallback.blogs.filter((post) => post.section === 'cowpedia' && post.topic === topic.slug)))
      .finally(() => setLoading(false));
  }, [topic]);

  if (!topic) return <Navigate to="/cowpedia" replace />;

  return (
    <section className="bg-white py-14 text-black md:py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-normal md:text-5xl">{topic.title}</h1>
          <p className="mt-3 text-2xl font-extrabold italic md:text-3xl">"{topic.subtitle}"</p>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-6">{topic.description}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#777]">Explore Featured Topics</p>
          <div className="mx-auto mt-6 flex max-w-[960px] flex-wrap justify-center gap-5">
            {cowpediaTopics.map((item) => (
              <Link
                key={item.slug}
                to={`/cowpedia/${item.slug}`}
                className={`min-w-[168px] rounded-full px-7 py-2 text-sm font-bold shadow-[0_2px_14px_rgba(0,0,0,0.08)] ${item.slug === topic.slug ? 'bg-[#fff0d6]' : 'bg-white'}`}
              >
                {item.title.replace(' & Science', '').replace('DivineDhenu Knowledge ', '')}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[950px] space-y-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-48 animate-pulse border border-[#ddd] bg-[#f5f5f5]" />)
          ) : null}

          {!loading && posts.map((post) => (
            <article key={post.id} className="grid border border-[#dedede] bg-white md:grid-cols-[300px_1fr]">
              <Link to={`/cowpedia/${topic.slug}/${post.slug}`} className="block bg-[#f3f3f3]" aria-label={post.title}>
                <ProductImage image={post.heroImageUrl} className="aspect-[1.54] h-full w-full" />
              </Link>
              <div className="flex flex-col justify-center p-5">
                <time className="text-sm font-medium uppercase tracking-[0.04em]">{formatDate(post.publishedAt || post.createdAt)}</time>
                <Link to={`/cowpedia/${topic.slug}/${post.slug}`} className="mt-3 text-xl font-medium leading-snug hover:text-[#9b7a00]">{post.title}</Link>
                <p className="mt-2 line-clamp-1 text-[15px] text-[#5e6671]">{post.excerpt}</p>
                <Link to={`/cowpedia/${topic.slug}/${post.slug}`} className="mt-3 w-fit border-b border-blue-700 text-blue-700">Read More</Link>
              </div>
            </article>
          ))}

          {!loading && !posts.length ? (
            <p className="border border-[#dedede] px-5 py-10 text-center text-sm text-[#666]">No CowPedia articles published in this topic yet.</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
