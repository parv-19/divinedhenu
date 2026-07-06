import { LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { publicApi } from '../../services/api.js';
import { transparentLogoUrl } from '../../utils/imageUrl.js';
import Container from '../common/Container.jsx';
import OfferStrip from './OfferStrip.jsx';

const links = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['CowPedia', '/cowpedia'],
  ['Contact', '/contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState({
    name: 'DivineDhenu',
    logo: '/divinedhenu-logo-mark.png',
    wordmark: '/divinedhenu-wordmark.png',
  });
  const { itemCount } = useCart();
  const { customer, isAuthenticated, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-ritual-gold ${isActive ? 'text-ritual-gold' : 'text-ritual-text'}`;

  useEffect(() => {
    publicApi.getSiteSettings()
      .then((settings) => setBrand({
        name: settings?.brandName === 'Aaroma Rituals' ? 'DivineDhenu' : settings?.brandName || 'DivineDhenu',
        logo: settings?.navbarLogo?.url || '/divinedhenu-logo-mark.png',
        wordmark: settings?.brandWordmark?.url || '/divinedhenu-wordmark.png',
      }))
      .catch(() => setBrand({
        name: 'DivineDhenu',
        logo: '/divinedhenu-logo-mark.png',
        wordmark: '/divinedhenu-wordmark.png',
      }));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ritual-border bg-ritual-background/88 backdrop-blur-xl">
      <OfferStrip />
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-2 text-ritual-text md:gap-3">
            <img src={transparentLogoUrl(brand.logo)} alt="" className="h-11 w-11 object-contain md:h-16 md:w-16" onError={(event) => { event.currentTarget.src = '/divinedhenu-logo-mark.png'; }} />
            <img src={transparentLogoUrl(brand.wordmark)} alt={brand.name} className="h-6 w-auto max-w-[150px] object-contain md:h-9 md:max-w-[230px]" onError={(event) => { event.currentTarget.src = '/divinedhenu-wordmark.png'; }} />
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map(([label, to]) => (
              <NavLink key={label} to={to} className={linkClass}>{label}</NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cart" className="focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-ritual-border bg-ritual-card text-ritual-text transition hover:border-ritual-gold">
              <ShoppingBag size={19} />
              {itemCount ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ritual-gold px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="focus-ring hidden h-11 items-center gap-2 rounded-full border border-ritual-border bg-ritual-card px-3 text-sm font-semibold text-ritual-text transition hover:border-ritual-gold md:inline-flex"
                title={`Logout ${customer?.name || ''}`}
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" className="focus-ring hidden h-11 items-center gap-2 rounded-full border border-ritual-border bg-ritual-card px-3 text-sm font-semibold text-ritual-text transition hover:border-ritual-gold md:inline-flex">
                <User size={16} /> Login
              </Link>
            )}
            <button
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-ritual-border bg-ritual-card text-ritual-text lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </Container>
      <div className={`border-t border-ritual-border bg-ritual-card/95 transition-all duration-300 lg:hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
        <Container className="py-4">
          <div className="grid gap-3">
            {links.map(([label, to]) => (
              <NavLink key={label} to={to} className="rounded-lg px-3 py-3 text-sm font-medium text-ritual-text hover:bg-ritual-background" onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button type="button" onClick={() => { logout(); setOpen(false); }} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-ritual-text hover:bg-ritual-background">
                Logout {customer?.name ? `(${customer.name})` : ''}
              </button>
            ) : (
              <NavLink to="/login" className="rounded-lg px-3 py-3 text-sm font-medium text-ritual-text hover:bg-ritual-background" onClick={() => setOpen(false)}>
                Login
              </NavLink>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
