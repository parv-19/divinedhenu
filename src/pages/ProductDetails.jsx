import { Minus, Plus, ShoppingBag, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge.jsx';
import { PrimaryButton, SecondaryButton } from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import ProductCard from '../components/common/ProductCard.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { fallback, publicApi } from '../services/api.js';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState('How to Use');
  const [activeImage, setActiveImage] = useState('');
  const { addToCart } = useCart();
  const soldOut = product?.stockStatus === 'Out of stock' || product?.stock <= 0;
  const buyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    publicApi.getProduct(slug)
      .then((item) => setProduct(item))
      .catch(() => {
        const item = fallback.products.find((fallbackProduct) => fallbackProduct.slug === slug);
        setProduct(item || null);
        setError(item ? 'Live product data is unavailable, showing fallback details.' : 'Product not found.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    publicApi.getProducts({ category: product.category, limit: 4 })
      .then(({ products }) => setRelated(products.filter((item) => item.id !== product.id).slice(0, 4)))
      .catch(() => setRelated(fallback.products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4)));
  }, [product]);

  useEffect(() => {
    setActiveImage(product?.images?.[0]?.url || product?.images?.[0] || product?.image || '');
  }, [product]);

  const accordions = useMemo(() => ([
    product?.howToUse ? ['How to Use', product.howToUse] : null,
    product?.ingredients ? ['Ingredients / Blend', product.ingredients] : null,
    ['Shipping', 'Orders usually ship within 24-48 hours. Delivery usually takes 3-7 business days, depending on the delivery pin code and courier serviceability.'],
  ].filter(Boolean)), [product]);

  if (loading) {
    return <Container className="py-20"><div className="h-96 animate-pulse rounded-lg bg-ritual-border/60" /></Container>;
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-4xl">Product not found</h1>
        <p className="mt-4 text-ritual-muted">{error || 'This ritual fragrance may have moved or sold out.'}</p>
        <PrimaryButton to="/shop" className="mt-8">Return to Shop</PrimaryButton>
      </Container>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        {error ? <p className="mb-6 rounded-lg bg-ritual-card px-4 py-3 text-sm text-ritual-muted">{error}</p> : null}
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} activeImage={activeImage} onSelect={setActiveImage} />
          <div>
            <Badge>{product.category}</Badge>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.moodTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <div className="mt-6 flex items-end gap-3">
              <p className="text-3xl font-semibold">Rs. {product.price}</p>
              {product.originalPrice ? <p className="text-lg text-ritual-muted line-through">Rs. {product.originalPrice}</p> : null}
            </div>
            <p className="mt-6 text-lg leading-8 text-ritual-muted">{product.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.ritualUse ? <Info title="Ritual Use" value={product.ritualUse} /> : null}
              <Info title="Stock Status" value={product.stockStatus} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex h-12 items-center rounded-full border border-ritual-border bg-ritual-card">
                <button className="focus-ring grid h-12 w-12 place-items-center rounded-full" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button className="focus-ring grid h-12 w-12 place-items-center rounded-full" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <PrimaryButton disabled={soldOut} onClick={() => addToCart(product, quantity)}><ShoppingBag size={18} /> Add to Cart</PrimaryButton>
              <SecondaryButton disabled={soldOut} onClick={buyNow}><Zap size={18} /> Buy Now</SecondaryButton>
            </div>
            <div className="mt-8 divide-y divide-ritual-border rounded-lg border border-ritual-border bg-ritual-card">
              {accordions.map(([title, body]) => (
                <div key={title}>
                  <button className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold" onClick={() => setOpen(open === title ? '' : title)}>
                    {title}
                    <span>{open === title ? '-' : '+'}</span>
                  </button>
                  {open === title ? <p className="px-5 pb-5 text-sm leading-7 text-ritual-muted">{body}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        {related.length ? (
          <div className="mt-16">
            <h2 className="font-serif text-3xl">Pairs Well With</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-lg border border-ritual-border bg-ritual-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ritual-gold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ritual-muted">{value}</p>
    </div>
  );
}

function ProductGallery({ product, activeImage, onSelect }) {
  const images = (product.images || [])
    .map((image) => image?.url || image)
    .filter(Boolean)
    .slice(0, 4);
  const galleryImages = images.length ? images : [product.image].filter(Boolean);

  return (
    <div className="min-w-0">
      <ProductImage image={activeImage || galleryImages[0]} className="aspect-square rounded-xl shadow-lift" />
      {galleryImages.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => onSelect(image)}
              className={`focus-ring w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition sm:w-24 ${image === activeImage ? 'border-ritual-gold' : 'border-ritual-border'}`}
              aria-label={`Show product image ${index + 1}`}
            >
              <ProductImage image={image} className="aspect-square rounded-md" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
