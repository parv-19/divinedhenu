const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const DEFAULT_PACKAGE = {
  length: 10,
  breadth: 10,
  height: 5,
  weight: 0.5,
};

let cachedToken = '';
let tokenFetchedAt = 0;
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireConfig = () => {
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    throw createError('Shiprocket credentials are not configured', 500);
  }
};

const parseShiprocketResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
};

export const getShiprocketToken = async ({ forceRefresh = false } = {}) => {
  requireConfig();

  if (!forceRefresh && cachedToken && Date.now() - tokenFetchedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await parseShiprocketResponse(response);

  if (!response.ok || !data.token) {
    console.error('Shiprocket auth failed', data);
    throw createError(data.message || 'Shiprocket authentication failed', response.status);
  }

  cachedToken = data.token;
  tokenFetchedAt = Date.now();
  return cachedToken;
};

const normalizeNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

export const getOrderPackage = (order) => {
  if (order.package?.length && order.package?.breadth && order.package?.height && order.package?.weight) {
    return {
      length: normalizeNumber(order.package.length, DEFAULT_PACKAGE.length),
      breadth: normalizeNumber(order.package.breadth, DEFAULT_PACKAGE.breadth),
      height: normalizeNumber(order.package.height, DEFAULT_PACKAGE.height),
      weight: normalizeNumber(order.package.weight, DEFAULT_PACKAGE.weight),
    };
  }

  const totals = (order.items || []).reduce((acc, item) => {
    const quantity = normalizeNumber(item.quantity, 1);
    acc.length = Math.max(acc.length, normalizeNumber(item.dimensions?.length, DEFAULT_PACKAGE.length));
    acc.breadth = Math.max(acc.breadth, normalizeNumber(item.dimensions?.breadth, DEFAULT_PACKAGE.breadth));
    acc.height += normalizeNumber(item.dimensions?.height, DEFAULT_PACKAGE.height) * quantity;
    acc.weight += normalizeNumber(item.dimensions?.weight, DEFAULT_PACKAGE.weight) * quantity;
    return acc;
  }, { length: 0, breadth: 0, height: 0, weight: 0 });

  return {
    length: normalizeNumber(totals.length, DEFAULT_PACKAGE.length),
    breadth: normalizeNumber(totals.breadth, DEFAULT_PACKAGE.breadth),
    height: normalizeNumber(totals.height, DEFAULT_PACKAGE.height),
    weight: normalizeNumber(totals.weight, DEFAULT_PACKAGE.weight),
  };
};

const formatOrderDate = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildShiprocketPayload = (order) => {
  const customer = order.customer || {};
  const orderPackage = getOrderPackage(order);

  return {
    order_id: order.orderNumber,
    order_date: formatOrderDate(order.createdAt ? new Date(order.createdAt) : new Date()),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'work',
    billing_customer_name: customer.name,
    billing_last_name: '',
    billing_address: customer.address,
    billing_address_2: '',
    billing_city: customer.city,
    billing_pincode: Number(customer.postalCode),
    billing_state: customer.state,
    billing_country: 'India',
    billing_email: customer.email,
    billing_phone: Number(customer.phone),
    shipping_is_billing: true,
    order_items: (order.items || []).map((item) => ({
      name: item.name,
      sku: item.sku || String(item.product || item.slug || item.name),
      units: item.quantity,
      selling_price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0,
      hsn: item.hsn || '',
    })),
    payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    shipping_charges: order.shipping || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: order.subtotal,
    ...orderPackage,
  };
};

const postShiprocketOrder = async (order, token) => {
  const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildShiprocketPayload(order)),
  });
  const data = await parseShiprocketResponse(response);
  return { response, data };
};

export const createShiprocketOrder = async (order) => {
  if (order.shiprocketShipmentId) return null;

  const missingSkuItem = (order.items || []).find((item) => !item.sku);
  if (missingSkuItem) {
    console.warn(`Order ${order.orderNumber} item ${missingSkuItem.name} is missing sku; using product id fallback for Shiprocket`);
  }
  // TODO: Maintain accurate product package dimensions for courier pricing instead of relying on safe defaults.

  let token = await getShiprocketToken();
  let { response, data } = await postShiprocketOrder(order, token);

  if (response.status === 401) {
    token = await getShiprocketToken({ forceRefresh: true });
    ({ response, data } = await postShiprocketOrder(order, token));
  }

  if (!response.ok) {
    console.error('Shiprocket order creation failed', data);
    throw createError(data.message || data.error || 'Shiprocket order creation failed', response.status);
  }

  return data;
};

export const extractShipmentFields = (data = {}) => ({
  shiprocketOrderId: data.order_id ? String(data.order_id) : '',
  shiprocketShipmentId: data.shipment_id ? String(data.shipment_id) : '',
  shiprocketStatus: data.status || data.status_code || 'created',
  awbCode: data.awb_code || data.awb || '',
  courierCompanyId: data.courier_company_id ? String(data.courier_company_id) : '',
  courierName: data.courier_name || data.courier_company || '',
  trackingUrl: data.tracking_url || '',
  shiprocketError: '',
});
