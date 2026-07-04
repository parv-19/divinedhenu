import { Plus, Tags, Ticket, Image } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const statLabels = [
  ['totalProducts', 'Total products'],
  ['activeProducts', 'Active products'],
  ['totalCategories', 'Categories'],
  ['bestsellersCount', 'Bestsellers'],
  ['lowStockProducts', 'Low stock'],
  ['activeOffers', 'Active offers'],
];

export default function Dashboard() {
  const [data, setData] = useState({ stats: {}, recentProducts: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/dashboard/stats')
      .then((response) => setData(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category', render: (row) => row.category?.name || '-' },
    { key: 'price', label: 'Price', render: (row) => `Rs. ${row.price}` },
    { key: 'stock', label: 'Stock' },
    { key: 'isActive', label: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ritual-text">Dashboard</h1>
          <p className="mt-1 text-sm text-ritual-muted">Catalog health and quick actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAction to="/admin/products/new" icon={Plus} label="Add Product" />
          <QuickAction to="/admin/categories/new" icon={Tags} label="Add Category" />
          <QuickAction to="/admin/offers" icon={Ticket} label="Manage Offers" />
          <QuickAction to="/admin/banners" icon={Image} label="Homepage Banner" />
        </div>
      </div>

      {error ? <p className="rounded-md bg-ritual-rose/20 px-3 py-2 text-sm">{error}</p> : null}
      {loading ? <p className="text-sm text-ritual-muted">Loading dashboard...</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statLabels.map(([key, label]) => (
          <div key={key} className="rounded-lg border border-ritual-border bg-ritual-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-ritual-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-ritual-text">{data.stats?.[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-serif text-2xl text-ritual-text">Recent products</h2>
        <DataTable columns={columns} rows={data.recentProducts || []} />
      </section>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link className="focus-ring inline-flex items-center gap-2 rounded-md border border-ritual-border bg-ritual-card px-3 py-2 text-sm font-medium text-ritual-text hover:border-ritual-gold" to={to}>
      <Icon size={16} />
      {label}
    </Link>
  );
}
