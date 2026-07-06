import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialFilters = {
  search: '',
  paymentStatus: '',
  orderStatus: '',
  page: 1,
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState('');
  const [loadingOrderId, setLoadingOrderId] = useState('');

  const loadOrders = () => {
    adminApi.get('/admin/orders', { params: filters })
      .then(({ data }) => {
        setOrders(data.orders || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      })
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadOrders, [filters]);

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value, page: key === 'page' ? value : 1 });

  const retryShiprocket = async (orderId) => {
    setLoadingOrderId(orderId);
    setError('');
    try {
      await adminApi.post(`/admin/orders/${orderId}/retry-shiprocket`);
      loadOrders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingOrderId('');
    }
  };

  const columns = [
    { key: 'orderNumber', label: 'Order' },
    { key: 'customer', label: 'Customer', render: (row) => `${row.customer?.name || '-'} | ${row.customer?.phone || '-'}` },
    { key: 'couponCode', label: 'Coupon', render: (row) => row.couponCode || '-' },
    { key: 'discount', label: 'Discount', render: (row) => row.discount ? `Rs. ${Number(row.discount).toFixed(2)}` : '-' },
    { key: 'total', label: 'Total', render: (row) => `Rs. ${Number(row.total || 0).toFixed(2)}` },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'razorpayPaymentId', label: 'Razorpay Payment ID', render: (row) => row.razorpayPaymentId || '-' },
    { key: 'orderStatus', label: 'Order Status' },
    { key: 'shiprocketOrderId', label: 'Shiprocket Order ID', render: (row) => row.shiprocketOrderId || '-' },
    { key: 'shiprocketShipmentId', label: 'Shiprocket Shipment ID', render: (row) => row.shiprocketShipmentId || '-' },
    { key: 'awbCode', label: 'AWB Code', render: (row) => row.awbCode || '-' },
    { key: 'courierName', label: 'Courier Name', render: (row) => row.courierName || '-' },
    { key: 'shiprocketError', label: 'Shiprocket Error', render: (row) => row.shiprocketError || '-' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-md border border-ritual-border px-3 py-2 text-xs font-semibold text-ritual-muted hover:text-ritual-text disabled:opacity-50"
          disabled={row.paymentStatus !== 'paid' || Boolean(row.shiprocketShipmentId) || loadingOrderId === row._id}
          onClick={() => retryShiprocket(row._id)}
          type="button"
        >
          <RefreshCw size={14} /> Retry
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">Orders</h1>
        <p className="mt-1 text-sm text-ritual-muted">Track payments and Shiprocket shipment creation.</p>
      </div>
      <div className="grid gap-3 rounded-lg border border-ritual-border bg-ritual-card p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search orders" className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
        <Select value={filters.paymentStatus} onChange={(value) => updateFilter('paymentStatus', value)} options={[['', 'All payments'], ['pending', 'Pending'], ['paid', 'Paid'], ['failed', 'Failed'], ['refunded', 'Refunded']]} />
        <Select value={filters.orderStatus} onChange={(value) => updateFilter('orderStatus', value)} options={[['', 'All order status'], ['pending', 'Pending'], ['payment_initiated', 'Payment initiated'], ['confirmed', 'Confirmed'], ['shipping_pending', 'Shipping pending'], ['shiprocket_order_created', 'Shiprocket created'], ['shipped', 'Shipped'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled'], ['refunded', 'Refunded']]} />
      </div>
      {error ? <p className="rounded-md bg-ritual-rose/20 px-3 py-2 text-sm">{error}</p> : null}
      <DataTable columns={columns} rows={orders} />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button disabled={pagination.page <= 1} onClick={() => updateFilter('page', filters.page - 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Previous</button>
        <span className="text-sm text-ritual-muted">Page {pagination.page} of {pagination.pages}</span>
        <button disabled={pagination.page >= pagination.pages} onClick={() => updateFilter('page', filters.page + 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Next</button>
      </div>
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
