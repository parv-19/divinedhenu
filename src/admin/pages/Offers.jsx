import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOffers = () => {
    adminApi.get('/admin/offers')
      .then(({ data }) => setOffers(data.offers || []))
      .catch((error) => setMessage(getErrorMessage(error)));
  };

  useEffect(loadOffers, []);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await adminApi.delete(`/admin/offers/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadOffers();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'text', label: 'Text' },
    { key: 'type', label: 'Type' },
    { key: 'couponCode', label: 'Coupon', render: (row) => row.couponCode || '-' },
    { key: 'discountPercent', label: 'Discount', render: (row) => row.discountPercent ? `${row.discountPercent}%` : '-' },
    { key: 'startDate', label: 'Start', render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : '-' },
    { key: 'endDate', label: 'End', render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : '-' },
    { key: 'isActive', label: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/offers/edit/${row._id}`} title="Edit">
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
          <h1 className="font-serif text-3xl text-ritual-text">Offers</h1>
          <p className="mt-1 text-sm text-ritual-muted">Create, update, and delete offer marquee, coupons, and campaigns.</p>
        </div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to="/admin/offers/new">
          <Plus size={16} /> Add offer
        </Link>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      <DataTable columns={columns} rows={offers} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete offer"
        message={`Delete "${deleteTarget?.text || 'this offer'}"?`}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
