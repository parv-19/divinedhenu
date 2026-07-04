import { ShoppingBag, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../products/ProductImage.jsx';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const rating = product.rating || (product.reviewCount ? 5 : 0);
  const reviewLabel = product.reviewCount === 1 ? '1 review' : `${product.reviewCount || 0} reviews`;
  const soldOut = product.stockStatus === 'Out of stock' || product.stock <= 0;
  const addProduct = () => addToCart(product);
  const buyNow = () => {
    addProduct();
    navigate('/checkout');
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#eee7df] bg-white p-2 text-[#121212] shadow-[0_5px_18px_rgba(0,0,0,0.06)] sm:p-3">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden rounded-lg">
        <ProductImage image={product.image} className="aspect-[1/0.92] transition duration-300 group-hover:scale-[1.02]" />
        <span className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-xs ${soldOut ? 'bg-[#111]' : 'bg-[#fd9d41]'}`}>
          {soldOut ? 'Sold out' : 'Sale'}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-2.5">
        <Link to={`/products/${product.slug}`} className="line-clamp-2 block min-h-[36px] text-xs font-semibold leading-[18px] transition hover:text-[#9a672c] sm:min-h-[40px] sm:text-sm sm:leading-5">
          {product.name}
        </Link>

        {rating ? (
          <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-sm">
            <span className="leading-none tracking-[-0.08em] text-[#ffd000] sm:text-lg">{'★'.repeat(rating)}</span>
            <span className="truncate text-[#4a4a4a]">{reviewLabel}</span>
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {product.originalPrice ? (
            <p className="text-[10px] text-[#777] line-through sm:text-xs">Rs. {Number(product.originalPrice).toFixed(2)}</p>
          ) : null}
          <p className="text-sm font-semibold sm:text-base">Rs. {Number(product.price).toFixed(2)}</p>
        </div>

        <div className="mt-auto grid grid-cols-[1fr_1.08fr] gap-1.5 pt-3 sm:gap-2">
          <button
            type="button"
            onClick={addProduct}
            disabled={soldOut}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#d8caba] bg-[#fffaf4] px-1.5 py-2 text-[11px] font-semibold leading-none text-[#3b2a1a] transition hover:border-[#b88746] hover:bg-[#f7f1e8] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-11 sm:gap-1.5 sm:px-2 sm:text-sm"
          >
            <ShoppingBag className="hidden sm:block" size={15} />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={buyNow}
            disabled={soldOut}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#2d1b0d] px-1.5 py-2 text-[11px] font-semibold leading-none text-white shadow-sm transition hover:bg-[#4a2f19] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-11 sm:gap-1.5 sm:px-2 sm:text-sm"
          >
            <Zap className="hidden sm:block" size={15} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </article>
  );
}
