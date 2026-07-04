import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialFilters = {
  search: '',
  category: '',
  isActive: '',
  isBestseller: '',
  isFeatured: '',
  sort: 'newest',
  page: 1,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = () => {
    adminApi.get('/admin/products', { params: filters })
      .then(({ data }) => {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      })
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    adminApi.get('/admin/categories').then(({ data }) => setCategories(data.categories || []));
  }, []);

  useEffect(loadProducts, [filters]);

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value, page: key === 'page' ? value : 1 });

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await adminApi.delete(`/admin/products/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.images?.[0]?.url ? <img src={row.images[0].url} alt="" className="h-12 w-16 rounded object-cover" /> : '-' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (row) => row.category?.name || '-' },
    { key: 'price', label: 'Price', render: (row) => `Rs. ${row.price}` },
    { key: 'stock', label: 'Stock' },
    { key: 'isActive', label: 'Active', render: (row) => row.isActive ? 'Yes' : 'No' },
    { key: 'isBestseller', label: 'Bestseller', render: (row) => row.isBestseller ? 'Yes' : 'No' },
    { key: 'isFeatured', label: 'Featured', render: (row) => row.isFeatured ? 'Yes' : 'No' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/products/edit/${row._id}`} title="Edit">
            <Edit size={16} />
          </Link>
          <button className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" onClick={() => setDeleteTarget(row)} type="button" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ritual-text">Products</h1>
          <p className="mt-1 text-sm text-ritual-muted">Manage the catalog shown in the shop.</p>
        </div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to="/admin/products/new">
          <Plus size={16} /> Add product
        </Link>
      </div>
      <div className="grid gap-3 rounded-lg border border-ritual-border bg-ritual-card p-4 md:grid-cols-3 xl:grid-cols-6">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search" className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
        <Select value={filters.category} onChange={(value) => updateFilter('category', value)} options={[['', 'All categories'], ...categories.map((item) => [item._id, item.name])]} />
        <Select value={filters.isActive} onChange={(value) => updateFilter('isActive', value)} options={[['', 'All status'], ['true', 'Active'], ['false', 'Inactive']]} />
        <Select value={filters.isBestseller} onChange={(value) => updateFilter('isBestseller', value)} options={[['', 'All bestsellers'], ['true', 'Bestseller'], ['false', 'Not bestseller']]} />
        <Select value={filters.isFeatured} onChange={(value) => updateFilter('isFeatured', value)} options={[['', 'All featured'], ['true', 'Featured'], ['false', 'Not featured']]} />
        <Select value={filters.sort} onChange={(value) => updateFilter('sort', value)} options={[['newest', 'Newest'], ['priceLow', 'Price low'], ['priceHigh', 'Price high']]} />
      </div>
      {error ? <p className="rounded-md bg-ritual-rose/20 px-3 py-2 text-sm">{error}</p> : null}
      <DataTable columns={columns} rows={products} />
      <div className="flex items-center justify-end gap-2">
        <button disabled={pagination.page <= 1} onClick={() => updateFilter('page', filters.page - 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Previous</button>
        <span className="text-sm text-ritual-muted">Page {pagination.page} of {pagination.pages}</span>
        <button disabled={pagination.page >= pagination.pages} onClick={() => updateFilter('page', filters.page + 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Next</button>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Delete ${deleteTarget?.name || 'this product'} and its images?`}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
      {options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}
    </select>
  );
}
