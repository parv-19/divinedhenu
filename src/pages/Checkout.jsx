import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import ProductImage from '../components/products/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { publicApi } from '../services/api.js';

const inputClass = 'mt-1 w-full rounded-md border border-ritual-border bg-white px-3 py-3 text-sm outline-none transition focus:border-ritual-gold';
const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const existingScript = document.querySelector(`script[src="${razorpayScriptUrl}"]`);
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(true), { once: true });
    existingScript.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = razorpayScriptUrl;
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = reject;
  document.body.appendChild(script);
});

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [shippingQuote, setShippingQuote] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const shipping = shippingQuote?.shipping || 0;
  const discount = shippingQuote?.discount || 0;

  useEffect(() => {
    const cleanPostalCode = postalCode.trim();
    setShippingQuote(null);
    setShippingError('');

    if (!items.length || cleanPostalCode.length < 6) return undefined;
    if (!/^\d{6}$/.test(cleanPostalCode)) {
      setShippingError('Enter a valid 6 digit PIN code.');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShippingLoading(true);
      publicApi.quoteShipping({
        postalCode: cleanPostalCode,
        email,
        phone,
        couponCode,
        paymentMethod,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      })
        .then((quote) => {
          setShippingQuote(quote);
          setShippingError('');
        })
        .catch((requestError) => {
          setShippingError(requestError.response?.data?.message || 'Could not calculate live shipping for this PIN code.');
        })
        .finally(() => setShippingLoading(false));
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [couponCode, email, items, paymentMethod, phone, postalCode]);

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    delete customer.payment;

    if (!shippingQuote) {
      setSubmitting(false);
      setError(shippingError || 'Enter a valid PIN code to calculate live shipping before placing the order.');
      return;
    }

    try {
      const data = await publicApi.createOrder({
        customer,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        paymentMethod,
        couponCode,
      });

      if (paymentMethod !== 'razorpay') {
        setOrderPlaced(data.order);
        clearCart();
        return;
      }

      await loadRazorpayScript();

      const razorpayKeyId = data.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) throw new Error('Razorpay key is not configured');

      const order = data.order;
      const razorpayOrder = data.razorpayOrder;

      await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: razorpayKeyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'DivineDhenu',
          description: `Order ${order.orderNumber}`,
          order_id: razorpayOrder.id,
          prefill: {
            name: order.customer.name,
            email: order.customer.email,
            contact: order.customer.phone,
          },
          notes: {
            orderNumber: order.orderNumber,
          },
          theme: {
            color: '#3f2818',
          },
          handler: async (response) => {
            try {
              const verifiedOrder = await publicApi.verifyPayment({
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              setOrderPlaced(verifiedOrder);
              clearCart();
              resolve();
            } catch (verifyError) {
              reject(verifyError);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled. Your order is still pending.')),
          },
        });

        razorpay.on('payment.failed', (response) => {
          reject(new Error(response.error?.description || 'Payment failed. Please try again.'));
        });

        razorpay.open();
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not place your order. Please try again.');
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
    <section className="py-8 md:py-16">
      <Container>
        <h1 className="font-serif text-3xl md:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-ritual-muted">Complete your details to place the order.</p>

        <form className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8" onSubmit={placeOrder}>
          <div className="min-w-0 rounded-lg border border-ritual-border bg-ritual-card p-4 shadow-soft md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">Delivery Details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" />
              <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} />
              <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Field label="PIN code" name="postalCode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={postalCode} onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, '').slice(0, 6))} />
              <Field label="Address" name="address" autoComplete="street-address" className="sm:col-span-2" />
              <Field label="City" name="city" autoComplete="address-level2" />
              <Field label="State" name="state" autoComplete="address-level1" />
            </div>

            <h2 className="mt-8 font-serif text-xl md:text-2xl">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PaymentOption value="razorpay" label="Online Payment" checked={paymentMethod === 'razorpay'} onChange={(event) => setPaymentMethod(event.target.value)} />
              <PaymentOption value="cod" label="Cash on Delivery" checked={paymentMethod === 'cod'} onChange={(event) => setPaymentMethod(event.target.value)} />
            </div>
          </div>

          <aside className="min-w-0 rounded-lg border border-ritual-border bg-ritual-card p-4 shadow-soft md:p-6 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="font-serif text-xl md:text-2xl">Order Summary</h2>
            <div className="mt-5 grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-3 sm:grid-cols-[64px_minmax(0,1fr)]">
                  <ProductImage image={item.image} className="aspect-square rounded-md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5">{item.name}</p>
                    <p className="mt-1 text-xs text-ritual-muted">Qty: {item.quantity} | Rs. {Number(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-ritual-border pt-4 text-sm">
              <label className="block">
                <span className="text-sm font-medium">Coupon code</span>
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase().replace(/\s/g, ''))} placeholder="DIVINE20" className={inputClass} />
              </label>
              <div className="flex justify-between gap-3"><span>Subtotal</span><span className="shrink-0">Rs. {Number(cartTotal).toFixed(2)}</span></div>
              {discount ? (
                <div className="flex justify-between gap-3 text-green-700">
                  <span>Coupon {shippingQuote?.couponCode ? `(${shippingQuote.couponCode})` : ''}</span>
                  <span className="shrink-0">- Rs. {Number(discount).toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <span>Shipping</span>
                <span className="shrink-0 text-right">{shippingLabel(shippingQuote, shippingLoading, postalCode)}</span>
              </div>
              {shippingQuote?.courierName ? <p className="text-xs text-ritual-muted">{shippingQuote.courierName}{shippingQuote.estimatedDeliveryDays ? ` | ${shippingQuote.estimatedDeliveryDays}` : ''}</p> : null}
              {shippingError ? <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{shippingError}</p> : null}
              <div className="flex justify-between gap-3 border-t border-ritual-border pt-3 text-base font-semibold sm:text-lg">
                <span>Total</span><span className="shrink-0">Rs. {Number(cartTotal - discount + shipping).toFixed(2)}</span>
              </div>
            </div>
            {error ? <p className="mt-5 rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">{error}</p> : null}
            <PrimaryButton type="submit" disabled={submitting || shippingLoading || !shippingQuote} className="mt-6 w-full">{submitting ? 'Processing...' : 'Place Order'}</PrimaryButton>
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

function shippingLabel(quote, loading, postalCode) {
  if (loading) return 'Calculating...';
  if (!postalCode || postalCode.length < 6) return 'Enter PIN code';
  if (!quote) return 'Unavailable';
  return `Rs. ${Number(quote.shipping || 0).toFixed(2)}`;
}

function PaymentOption({ value, label, ...props }) {
  return (
    <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-md border border-ritual-border bg-white px-4 py-3 text-sm font-semibold sm:py-4">
      <input required type="radio" name="payment" value={value} {...props} />
      {label}
    </label>
  );
}
