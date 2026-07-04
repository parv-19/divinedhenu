import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { publicApi } from '../services/api.js';

const inputClass = 'mt-1 w-full rounded-md border border-ritual-border bg-white px-3 py-3 text-sm outline-none transition focus:border-ritual-gold';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const shipping = cartTotal >= 999 ? 0 : 79;

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      const order = await publicApi.createOrder({
        customer: Object.fromEntries(formData.entries()),
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });
      setOrderPlaced(order);
      clearCart();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-4xl">Thank you for your order</h1>
        <p className="mx-auto mt-4 max-w-xl text-ritual-muted">Your order <strong>{orderPlaced.orderNumber}</strong> has been received. We will contact you shortly with the next update.</p>
        <PrimaryButton to="/shop" className="mt-8">Continue Shopping</PrimaryButton>
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-ritual-muted">Add a product before continuing to checkout.</p>
        <PrimaryButton to="/shop" className="mt-8">Browse Products</PrimaryButton>
      </Container>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <Container>
        <h1 className="font-serif text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-ritual-muted">Complete your details to place the order.</p>

        <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" onSubmit={placeOrder}>
          <div className="rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft md:p-7">
            <h2 className="font-serif text-2xl">Delivery Details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" />
              <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" />
              <Field label="Email" name="email" type="email" autoComplete="email" />
              <Field label="PIN code" name="postalCode" inputMode="numeric" autoComplete="postal-code" />
              <Field label="Address" name="address" autoComplete="street-address" className="sm:col-span-2" />
              <Field label="City" name="city" autoComplete="address-level2" />
              <Field label="State" name="state" autoComplete="address-level1" />
            </div>

            <h2 className="mt-8 font-serif text-2xl">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PaymentOption value="cod" label="Cash on Delivery" defaultChecked />
              <div className="rounded-md border border-dashed border-ritual-border bg-white/50 px-4 py-4 text-sm text-ritual-muted">
                Online Payment <span className="ml-1 text-xs">(coming soon)</span>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft md:p-6">
            <h2 className="font-serif text-2xl">Order Summary</h2>
            <div className="mt-5 grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[64px_1fr] gap-3">
                  <ProductImage image={item.image} className="aspect-square rounded-md" />
                  <div>
                    <p className="text-sm font-semibold leading-5">{item.name}</p>
                    <p className="mt-1 text-xs text-ritual-muted">Qty: {item.quantity} | Rs. {Number(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-ritual-border pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {Number(cartTotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `Rs. ${shipping}` : 'Free'}</span></div>
              <div className="flex justify-between border-t border-ritual-border pt-3 text-lg font-semibold">
                <span>Total</span><span>Rs. {Number(cartTotal + shipping).toFixed(2)}</span>
              </div>
            </div>
            {error ? <p className="mt-5 rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">{error}</p> : null}
            <PrimaryButton type="submit" disabled={submitting} className="mt-6 w-full">{submitting ? 'Placing Order...' : 'Place Order'}</PrimaryButton>
            <Link to="/cart" className="mt-4 block text-center text-sm font-semibold text-ritual-muted hover:text-ritual-gold">Back to Cart</Link>
          </aside>
        </form>
      </Container>
    </section>
  );
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`text-sm font-medium ${className}`}>
      {label}
      <input required className={inputClass} {...props} />
    </label>
  );
}

function PaymentOption({ value, label, ...props }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-ritual-border bg-white px-4 py-4 text-sm font-semibold">
      <input required type="radio" name="payment" value={value} {...props} />
      {label}
    </label>
  );
}
