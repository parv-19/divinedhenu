import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCategories = () => {
    adminApi.get('/admin/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadCategories, []);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await adminApi.delete(`/admin/categories/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.image?.url ? <img src={row.image.url} alt="" className="h-12 w-16 rounded object-cover" /> : '-' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'isActive', label: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' },
    { key: 'sortOrder', label: 'Sort' },
    { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/categories/edit/${row._id}`} title="Edit">
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
          <h1 className="font-serif text-3xl text-ritual-text">Categories</h1>
          <p className="mt-1 text-sm text-ritual-muted">Organize products and shop navigation.</p>
        </div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to="/admin/categories/new">
          <Plus size={16} /> Add category
        </Link>
      </div>
      {error ? <p className="rounded-md bg-ritual-rose/20 px-3 py-2 text-sm">{error}</p> : null}
      <DataTable columns={columns} rows={categories} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={`Delete ${deleteTarget?.name || 'this category'}? This is blocked if products exist in it.`}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
