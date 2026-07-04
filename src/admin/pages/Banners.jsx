import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [message, setMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBanners = () => {
    adminApi.get('/admin/banners')
      .then(({ data }) => setBanners(data.banners || []))
      .catch((error) => setMessage(getErrorMessage(error)));
  };

  useEffect(loadBanners, []);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await adminApi.delete(`/admin/banners/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadBanners();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.image?.url ? <img src={row.image.url} alt="" className="h-12 w-20 rounded object-cover" /> : '-' },
    { key: 'title', label: 'Title', render: (row) => row.title || 'Image only' },
    { key: 'position', label: 'Position' },
    { key: 'isActive', label: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' },
    { key: 'sortOrder', label: 'Sort' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/banners/edit/${row._id}`} title="Edit">
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
          <h1 className="font-serif text-3xl text-ritual-text">Banners</h1>
          <p className="mt-1 text-sm text-ritual-muted">Add carousel slides for the homepage and shop banners.</p>
        </div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to="/admin/banners/new">
          <Plus size={16} /> Add banner
        </Link>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      <DataTable columns={columns} rows={banners} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete banner"
        message={`Delete ${deleteTarget?.title || 'this banner'}?`}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
