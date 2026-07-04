import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  if (!items.length) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-4xl">Your ritual cart is empty</h1>
        <p className="mt-4 text-ritual-muted">Add incense, dhoop, or a gift set to begin.</p>
        <PrimaryButton to="/shop" className="mt-8">Shop Rituals</PrimaryButton>
      </Container>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-serif text-4xl">Your Ritual Cart</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-lg border border-ritual-border bg-ritual-card p-4 shadow-soft sm:grid-cols-[140px_1fr_auto]">
                <Link to={`/products/${item.slug}`}>
                  <ProductImage image={item.image} className="aspect-square rounded-lg" />
                </Link>
                <div>
                  <p className="text-sm text-ritual-muted">{item.category}</p>
                  <Link to={`/products/${item.slug}`} className="mt-1 block font-serif text-2xl">{item.name}</Link>
                  <p className="mt-3 font-semibold">₹{item.price}</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ritual-muted hover:text-ritual-gold" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-full border border-ritual-border bg-ritual-background">
                    <button className="grid h-10 w-10 place-items-center" onClick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity"><Minus size={15} /></button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button className="grid h-10 w-10 place-items-center" onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity"><Plus size={15} /></button>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-soft">
            <h2 className="font-serif text-2xl">Order Summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{cartTotal >= 999 ? 'Free' : '₹79'}</span></div>
              <div className="border-t border-ritual-border pt-4 text-lg font-semibold">
                <div className="flex justify-between"><span>Total</span><span>₹{cartTotal + (cartTotal >= 999 ? 0 : 79)}</span></div>
              </div>
            </div>
            <p className="mt-5 rounded-lg bg-ritual-background p-3 text-sm text-ritual-muted">Free shipping on prepaid orders above ₹999.</p>
            <PrimaryButton to="/checkout" className="mt-6 w-full">Checkout</PrimaryButton>
            <SecondaryButton to="/shop" className="mt-3 w-full">Continue Shopping</SecondaryButton>
          </aside>
        </div>
      </Container>
    </section>
  );
}
