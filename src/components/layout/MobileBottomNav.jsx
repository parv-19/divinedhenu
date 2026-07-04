import { Home, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

const links = [
  ['Home', '/', Home],
  ['Shop', '/shop', Store],
  ['Cart', '/cart', ShoppingBag],
  ['Help', '/contact', MessageCircle],
];

export default function MobileBottomNav() {
  const { itemCount } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-ritual-border bg-white/95 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
      {links.map(([label, to, Icon]) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) => `relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold ${isActive ? 'text-ritual-gold' : 'text-ritual-muted'}`}
        >
          <Icon size={19} />
          <span>{label}</span>
          {label === 'Cart' && itemCount ? (
            <span className="absolute left-1/2 top-0 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-ritual-gold px-1 text-[10px] text-white">
              {itemCount}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
