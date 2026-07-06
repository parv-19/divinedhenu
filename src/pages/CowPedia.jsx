import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Container from '../components/common/Container.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import SEO from '../components/common/SEO.jsx';
import { cowpediaTopics } from '../data/cowpediaTopics.js';
import { publicApi } from '../services/api.js';

export default function CowPedia() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    publicApi.getBlogs({ section: 'cowpedia', limit: 100 })
      .then((data) => setPosts(data.blogs || []))
      .catch(() => setPosts([]));
  }, []);

  const postsByTopic = useMemo(() => (
    posts.reduce((result, post) => {
      if (!result[post.topic]) result[post.topic] = [];
      result[post.topic].push(post);
      return result;
    }, {})
  ), [posts]);

  return (
    <section className="bg-white py-14 text-black md:py-20">
      <SEO
        title="CowPedia by DivineDhenu | Indian Cow Knowledge in Gujarat"
        description="Explore CowPedia by DivineDhenu for Indian cow knowledge, A2 milk education, cow care, culture, traditions and transparent dairy learning."
        path="/cowpedia"
        keywords="CowPedia Gujarat, Indian cow knowledge, A2 milk Gujarat, cow care Ahmedabad, Indian cow tradition, DivineDhenu CowPedia"
      />
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-normal md:text-5xl">CowPedia</h1>
          <p className="mt-3 text-2xl font-extrabold italic md:text-3xl">"The Complete Knowledge Base of Indian Cows"</p>
          <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-6">
            CowPedia is a comprehensive knowledge hub dedicated to Indian cows, covering indigenous breeds, A2 milk, cow care, ethical dairy, nutrition, cultural traditions, buying guides, and transparent farm practices.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[960px] gap-6 md:grid-cols-3">
          {cowpediaTopics.map((topic) => {
            const latestPost = postsByTopic[topic.slug]?.[0];
            return (
              <Link key={topic.slug} to={`/cowpedia/${topic.slug}`} className="group overflow-hidden rounded-lg border border-[#dcdcdc] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                {latestPost?.heroImageUrl || topic.image ? (
                  <ProductImage image={latestPost?.heroImageUrl || topic.image} className="aspect-[1.56] w-full" />
                ) : (
                  <div className="grid aspect-[1.56] place-items-center bg-[#f4efe7] px-6 text-center text-xl font-bold text-[#4a2f1d]">{topic.title}</div>
                )}
                <div className="p-3">
                  <h2 className="text-lg font-extrabold leading-tight">{topic.title}</h2>
                  <p className="mt-1 text-sm leading-[1.25] text-[#4f5864]">{topic.description}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-black group-hover:text-[#9b7a00]">{topic.cta} &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-[970px] text-[15px] leading-6">
          <h2 className="text-center text-3xl font-extrabold md:text-left">Understanding Indian Cows Through Knowledge, Tradition, and Science</h2>
          <p className="mt-5">Indian cows have been an essential part of food systems, health practices, farming economies, and cultural traditions for thousands of years. CowPedia is structured to document this knowledge in a systematic and easy-to-understand way.</p>
          <p className="mt-4">The knowledge base begins with fundamentals: indigenous breeds, milk types, A2 milk, cow nutrition, ethical dairy practices, and the relationship between animal care and dairy quality.</p>
          <p className="mt-4">CowPedia also explores the cultural, spiritual, and historical importance of cows in Indian households, rituals, festivals, farming communities, and rural livelihoods.</p>
        </div>
      </Container>
    </section>
  );
}
