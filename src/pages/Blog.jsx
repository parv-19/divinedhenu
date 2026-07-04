import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import { publicApi } from '../services/api.js';

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(value));

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    publicApi.getBlogs({ section: 'blog', limit: 24 })
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => setError('Blog posts are unavailable right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-14 text-[#050505] md:py-20">
      <Container>
        <h1 className="text-center text-5xl font-semibold tracking-normal md:text-6xl">Blog</h1>

        {loading ? (
          <div className="mt-14 grid gap-x-9 gap-y-10 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-5">
                <div className="aspect-[1.54] animate-pulse bg-[#f1f1f1]" />
                <div className="h-4 w-32 animate-pulse bg-[#f1f1f1]" />
                <div className="h-20 animate-pulse bg-[#f1f1f1]" />
              </div>
            ))}
          </div>
        ) : null}

        {error ? <p className="mt-10 text-center text-sm text-[#666]">{error}</p> : null}

        {!loading && blogs.length ? (
          <div className="mt-14 grid gap-x-9 gap-y-12 md:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="group">
                <Link to={`/blog/${blog.slug}`} className="block overflow-hidden bg-[#f2f2f2]">
                  <img src={blog.heroImageUrl} alt={blog.heroImage?.alt || blog.title} className="aspect-[1.54] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                </Link>
                <time className="mt-9 block text-sm font-bold uppercase tracking-[0.08em] text-black">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </time>
                <Link to={`/blog/${blog.slug}`} className="mt-4 block text-[26px] font-normal leading-[1.38] tracking-normal text-black transition group-hover:text-[#9b7a00]">
                  {blog.title}
                </Link>
                <p className="mt-4 line-clamp-2 text-[21px] leading-[1.65] text-[#5e6671]">{blog.excerpt}</p>
                <Link to={`/blog/${blog.slug}`} className="mt-5 inline-block border-b border-[#bfbfbf] pb-1 text-[21px] leading-none text-black transition hover:text-[#9b7a00]">
                  Read More
                </Link>
              </article>
            ))}
          </div>
        ) : null}

        {!loading && !blogs.length && !error ? (
          <p className="mt-10 text-center text-sm text-[#666]">No blog posts published yet.</p>
        ) : null}
      </Container>
    </section>
  );
}
