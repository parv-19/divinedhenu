import { Link, useParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductImage from '../components/products/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { publicApi } from '../services/api.js';

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    publicApi.getBlog(slug)
      .then(setBlog)
      .catch(() => setError('Blog post not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (blog?.title) document.title = `${blog.metaTitle || blog.title} | DivineDhenu`;
  }, [blog]);

  const productBlocks = useMemo(() => (
    (blog?.contentBlocks || []).filter((block) => block.type === 'products').length
  ), [blog]);

  if (loading) {
    return <div className="bg-white py-24 text-center text-sm text-[#666]">Loading...</div>;
  }

  if (error || !blog) {
    return <div className="bg-white py-24 text-center text-sm text-[#666]">{error}</div>;
  }

  return (
    <article className="bg-white pb-20 pt-12 text-[#121212] md:pt-20">
      <div className="mx-auto max-w-[980px] px-4">
        <h1 className="mx-auto max-w-[900px] text-center text-4xl font-normal leading-[1.45] tracking-normal md:text-[38px]">
          {blog.title}
        </h1>
        <img src={blog.heroImageUrl} alt={blog.heroImage?.alt || blog.title} className="mx-auto mt-10 aspect-[1.54] w-full max-w-[870px] object-cover" />
      </div>

      <div className="mx-auto mt-10 max-w-[870px] px-4 text-[17px] leading-[1.72] text-[#5b6370]">
        {(blog.contentBlocks || []).map((block, index) => (
          <BlogBlock
            key={`${block.type}-${index}`}
            block={block}
            products={blog.featuredProducts}
            showProducts={block.type === 'products' || (!productBlocks && index === 2)}
          />
        ))}
      </div>
    </article>
  );
}

function BlogBlock({ block, products, showProducts }) {
  if (block.type === 'heading') {
    return <h2 className="mt-10 text-[31px] font-semibold leading-[1.28] text-black">{block.text}</h2>;
  }

  if (block.type === 'subheading') {
    return <h3 className="mt-8 text-[26px] font-semibold leading-[1.28] text-black">{block.text}</h3>;
  }

  if (block.type === 'list') {
    return (
      <ul className="mt-5 list-disc space-y-2 pl-5">
        {(block.items || []).map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }

  if (block.type === 'image') {
    return block.image?.url ? (
      <img src={block.image.url} alt={block.image.alt || ''} className="mt-8 aspect-[1.54] w-full object-cover" />
    ) : null;
  }

  if (block.type === 'products') {
    return <BlogProducts products={products} />;
  }

  return (
    <>
      <p className="mt-6 whitespace-pre-line">{block.text}</p>
      {showProducts ? <BlogProducts products={products} /> : null}
    </>
  );
}

function BlogProducts({ products }) {
  const visibleProducts = (products || []).slice(0, 2);
  if (!visibleProducts.length) return null;

  return (
    <div className="my-8 grid gap-8 sm:grid-cols-2">
      {visibleProducts.map((product) => <BlogProductCard key={product.id || product._id} product={product} />)}
    </div>
  );
}

function BlogProductCard({ product }) {
  const { addToCart } = useCart();
  const originalPrice = Number(product.originalPrice || 0);
  const price = Number(product.price || 0);
  const bestPrice = Math.round(price * 0.95);

  return (
    <article className="text-center text-black">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden rounded-md">
        <ProductImage image={product.image} className="aspect-square" />
        {product.isBestseller ? (
          <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#ff9800] px-10 py-4 text-lg font-bold text-white">Best Seller</span>
        ) : null}
      </Link>
      <div className="mt-6 text-lg leading-none tracking-[-0.08em] text-[#ff9800]">★★★★★</div>
      <Link to={`/products/${product.slug}`} className="mt-3 block text-lg font-bold leading-snug">{product.name}</Link>
      <div className="mt-3 flex justify-center gap-2 text-base">
        {originalPrice ? <span className="text-[#999] line-through">Rs. {originalPrice.toFixed(2)}</span> : null}
        <span>Rs. {price.toFixed(2)}</span>
      </div>
      <p className="mt-3 text-lg font-bold text-[#a00000]">Best Price: Rs.{bestPrice} with Coupons</p>
      <button
        type="button"
        onClick={() => addToCart(product)}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#4a2f1d] px-10 py-2 text-sm font-bold text-white transition hover:bg-[#2d1b0d]"
      >
        <ShoppingBag size={16} />
        Add to cart
      </button>
    </article>
  );
}
