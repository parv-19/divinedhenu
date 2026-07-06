import {
  Boxes,
  FileText,
  Image,
  Layers,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  ReceiptText,
  Settings,
  Tags,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/combos', label: 'Combos', icon: Layers },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/offers', label: 'Offers', icon: Boxes },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareQuote },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-ritual-border bg-ritual-card lg:block">
      <div className="border-b border-ritual-border px-6 py-5">
        <p className="font-serif text-2xl text-ritual-text">DivineDhenu CMS</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ritual-muted">Admin panel</p>
      </div>
      <nav className="space-y-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => [
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-ritual-text text-ritual-card'
                : 'text-ritual-muted hover:bg-ritual-background hover:text-ritual-text',
            ].join(' ')}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
