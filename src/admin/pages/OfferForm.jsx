import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialForm = {
  text: '',
  type: 'marquee',
  discountPercent: '',
  couponCode: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

export default function OfferForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/admin/offers/${id}`).then(({ data }) => {
      const offer = data.offer;
      setForm({
        text: offer.text || '',
        type: offer.type || 'marquee',
        discountPercent: offer.discountPercent || '',
        couponCode: offer.couponCode || '',
        startDate: toDateInput(offer.startDate),
        endDate: toDateInput(offer.endDate),
        isActive: Boolean(offer.isActive),
      });
    }).catch((error) => setMessage(getErrorMessage(error)));
  }, [id, isEdit]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.text.trim()) {
      setMessage('Offer text is required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isEdit) await adminApi.put(`/admin/offers/${id}`, form);
      else await adminApi.post('/admin/offers', form);
      navigate('/admin/offers');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">{isEdit ? 'Edit Offer' : 'Add Offer'}</h1>
        <p className="mt-1 text-sm text-ritual-muted">Marquee offers appear in the top offer strip when active and within date range.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}

      <div className="space-y-4 rounded-lg border border-ritual-border bg-ritual-card p-5">
        <Field required label="Offer text" value={form.text} onChange={(value) => update('text', value)} />
        <label className="block">
          <span className="text-sm font-medium text-ritual-text">Type</span>
          <select value={form.type} onChange={(event) => update('type', event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
            <option value="marquee">Marquee</option>
            <option value="coupon">Coupon</option>
            <option value="banner">Banner</option>
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field type="number" label="Discount percent" value={form.discountPercent} onChange={(value) => update('discountPercent', value)} />
          <Field label="Coupon code" value={form.couponCode} onChange={(value) => update('couponCode', value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field type="date" label="Start date" value={form.startDate} onChange={(value) => update('startDate', value)} />
          <Field type="date" label="End date" value={form.endDate} onChange={(value) => update('endDate', value)} />
        </div>
        <Toggle label="Active" checked={form.isActive} onChange={(value) => update('isActive', value)} />
      </div>

      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save offer'}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ritual-text">{label}</span>
      <input required={required} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-ritual-text">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-ritual-gold" />
      {label}
    </label>
  );
}

function toDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
