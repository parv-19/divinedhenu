import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi.get('/admin/reviews')
      .then(({ data }) => setReviews(data.reviews || []))
      .catch((error) => setMessage(getErrorMessage(error)));
  }, []);

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'city', label: 'City' },
    { key: 'rating', label: 'Rating' },
    { key: 'product', label: 'Product', render: (row) => row.product?.name || '-' },
    { key: 'isActive', label: 'Active', render: (row) => row.isActive ? 'Yes' : 'No' },
    { key: 'isFeatured', label: 'Featured', render: (row) => row.isFeatured ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">Reviews</h1>
        <p className="mt-1 text-sm text-ritual-muted">Customer review records for homepage and product context.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      <DataTable columns={columns} rows={reviews} />
    </div>
  );
}
