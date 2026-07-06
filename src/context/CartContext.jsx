import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { customer } = useAuth();
  const cartKey = customer?._id ? `divinedhenu-cart:${customer._id}` : 'divinedhenu-cart:guest';
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('divinedhenu-cart:guest')) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [cartKey, items]);

  useEffect(() => {
    try {
      const nextItems = JSON.parse(localStorage.getItem(cartKey)) || [];
      const guestItems = JSON.parse(localStorage.getItem('divinedhenu-cart:guest')) || [];

      if (customer?._id && guestItems.length) {
        const merged = mergeCartItems(nextItems, guestItems);
        localStorage.setItem(cartKey, JSON.stringify(merged));
        localStorage.removeItem('divinedhenu-cart:guest');
        setItems(merged);
        return;
      }

      setItems(nextItems);
    } catch {
      setItems([]);
    }
  }, [cartKey, customer?._id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = (product, quantity = 1) => {
    const productId = product.id || product._id;
    setItems((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) {
        return current.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { ...product, id: productId, quantity }];
    });
    setToast('Added to your ritual cart');
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const decreaseQuantity = (id) => {
    setItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      itemCount,
      cartTotal,
      toast,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    };
  }, [items, toast]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ritual-brown px-5 py-3 text-sm font-medium text-ritual-card shadow-lift">
          {toast}
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

function mergeCartItems(target, source) {
  return source.reduce((result, item) => {
    const existing = result.find((current) => current.id === item.id);
    if (!existing) return [...result, item];
    return result.map((current) => (
      current.id === item.id ? { ...current, quantity: current.quantity + item.quantity } : current
    ));
  }, target);
}
