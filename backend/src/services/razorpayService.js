import crypto from 'crypto';

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw createError('Razorpay credentials are not configured', 500);
  }

  return { keyId, keySecret };
};

export const getPublicRazorpayKey = () => (
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''
);

export const createRazorpayOrder = async ({ amount, receipt, notes = {} }) => {
  const { keyId, keySecret } = getCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt,
      notes,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Razorpay order creation failed', data);
    throw createError(data.error?.description || 'Could not create Razorpay order', response.status);
  }

  return data;
};

export const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const { keySecret } = getCredentials();
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(String(razorpaySignature || ''));
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

export const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw createError('Razorpay webhook secret is not configured', 500);
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(String(signature));
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};
