import { Edit, Plus, Tags } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const comboName = 'Combo - Saver Pack';

export default function Combos() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const comboCategory = useMemo(() => (
    categories.find((category) => category.name.toLowerCase() === comboName.toLowerCase())
    || categories.find((category) => category.name.toLowerCase().includes('combo'))
  ), [categories]);

  const loadData = async () => {
    try {
      const [{ data: categoryData }, { data: productData }] = await Promise.all([
        adminApi.get('/admin/categories'),
        adminApi.get('/admin/products', { params: { limit: 100, sort: 'newest' } }),
      ]);
      setCategories(categoryData.categories || []);
      setProducts(productData.products || []);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createComboCategory = async () => {
    setLoading(true);
    setMessage('');
    const body = new FormData();
    body.append('name', comboName);
    body.append('description', 'Combo and saver pack products.');
    body.append('sortOrder', 0);
    body.append('isActive', true);

    try {
      await adminApi.post('/admin/categories', body);
      await loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const comboProducts = comboCategory
    ? products.filter((product) => product.category?._id === comboCategory._id)
    : [];

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.images?.[0]?.url ? <img src={row.images[0].url} alt="" className="h-12 w-16 rounded object-cover" /> : '-' },
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', render: (row) => `Rs. ${row.price}` },
    { key: 'stock', label: 'Stock' },
    { key: 'isActive', label: 'Active', render: (row) => row.isActive ? 'Yes' : 'No' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/products/edit/${row._id}`} title="Edit">
            <Edit size={16} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ritual-text">Combos</h1>
          <p className="mt-1 text-sm text-ritual-muted">Manage products for the Combo - Saver Pack storefront section.</p>
        </div>
        {comboCategory ? (
          <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to={`/admin/products/new?category=${comboCategory._id}`}>
            <Plus size={16} /> Add combo product
          </Link>
        ) : (
          <button disabled={loading} onClick={createComboCategory} className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card disabled:opacity-60" type="button">
            <Tags size={16} /> Create combo category
          </button>
        )}
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      {!comboCategory ? (
        <div className="rounded-lg border border-ritual-border bg-ritual-card p-8 text-center">
          <h2 className="font-serif text-2xl text-ritual-text">Create Combo - Saver Pack category first</h2>
          <p className="mt-2 text-sm text-ritual-muted">After that, combo products can be added into this category and will show on the homepage automatically.</p>
        </div>
      ) : (
        <DataTable columns={columns} rows={comboProducts} />
      )}
    </div>
  );
}
