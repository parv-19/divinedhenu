import mongoose from 'mongoose';
import Offer from '../models/Offer.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createRazorpayOrder, getPublicRazorpayKey, verifyPaymentSignature } from './razorpayService.js';
import { createShiprocketOrder, extractShipmentFields, getOrderPackage, getShiprocketShippingRate } from './shiprocketService.js';

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createOrderNumber = () => (
  `DD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
);

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 0;
};

const normalizePaymentMethod = (value) => (value === 'razorpay' ? 'razorpay' : 'cod');

const normalizeCouponCode = (value) => String(value || '').trim().toUpperCase();

const isFreeShippingEligible = ({ subtotal, paymentMethod }) => (
  paymentMethod === 'razorpay' && subtotal >= 999
);

const validateCustomer = (customer = {}) => {
  const requiredFields = ['name', 'phone', 'email', 'address', 'city', 'state', 'postalCode'];
  requiredFields.forEach((field) => {
    if (!String(customer[field] || '').trim()) throw createError(`${field} is required`);
  });

  if (!/^[6-9]\d{9}$/.test(String(customer.phone).replace(/\D/g, ''))) {
    throw createError('Enter a valid 10 digit mobile number');
  }

  if (!/^\d{6}$/.test(String(customer.postalCode).trim())) {
    throw createError('Enter a valid 6 digit PIN code');
  }
};

const mapOrderItems = (productIds, quantityByProduct, productMap) => productIds.map((productId) => {
  const product = productMap.get(productId);
  const quantity = quantityByProduct.get(productId);

  if (!product) throw createError('One or more products are no longer available');
  if (!quantity) throw createError('Product quantity must be at least 1');
  if (product.stock < quantity) throw createError(`${product.name} does not have enough stock`);

  const dimensions = {
    length: product.package?.length || product.dimensions?.length || product.length || 10,
    breadth: product.package?.breadth || product.dimensions?.breadth || product.breadth || 10,
    height: product.package?.height || product.dimensions?.height || product.height || 5,
    weight: product.package?.weight || product.dimensions?.weight || product.weight || 0.5,
  };

  return {
    product: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0]?.url || '',
    price: product.price,
    quantity,
    sku: product.sku || String(product._id),
    dimensions,
  };
});

const getActiveCoupon = async (couponCode) => {
  const normalizedCode = normalizeCouponCode(couponCode);
  if (!normalizedCode) return null;

  const now = new Date();
  const coupon = await Offer.findOne({
    type: 'coupon',
    couponCode: normalizedCode,
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
    ],
  });

  if (!coupon) throw createError('Coupon is invalid or expired');
  if (!coupon.discountPercent) throw createError('Coupon does not have a discount configured');
  return coupon;
};

const validateCouponRules = async ({ coupon, items, customer = {} }) => {
  if (!coupon) return;

  const code = normalizeCouponCode(coupon.couponCode);
  const text = String(coupon.text || '').toLowerCase();
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  if ((code === 'DIVINE20' || text.includes('buy 3')) && totalUnits < 3) {
    throw createError('DIVINE20 is applicable when you buy at least 3 products');
  }

  if (code === 'FIRST10' || text.includes('first order')) {
    const email = String(customer.email || '').trim().toLowerCase();
    const phone = String(customer.phone || '').replace(/\D/g, '');

    if (!email && !phone) {
      throw createError('Enter email or phone number to apply first order coupon');
    }

    const previousOrder = await Order.exists({
      $or: [
        ...(email ? [{ 'customer.email': email }] : []),
        ...(phone ? [{ 'customer.phone': phone }] : []),
      ],
    });

    if (previousOrder) throw createError('FIRST10 is only valid on your first order');
  }
};

const buildOrderPricing = async (body) => {
  const requestedItems = Array.isArray(body.items) ? body.items : [];
  if (!requestedItems.length) throw createError('Order must include at least one product');

  const quantityByProduct = new Map();
  requestedItems.forEach((item) => {
    const productId = String(item.productId);
    quantityByProduct.set(productId, (quantityByProduct.get(productId) || 0) + normalizeQuantity(item.quantity));
  });

  const productIds = [...quantityByProduct.keys()];
  if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw createError('Order contains an invalid product');
  }

  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items = mapOrderItems(productIds, quantityByProduct, productMap);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const paymentMethod = normalizePaymentMethod(body.paymentMethod || body.payment);
  const coupon = await getActiveCoupon(body.couponCode);
  await validateCouponRules({ coupon, items, customer: body.customer });
  const discountPercent = coupon?.discountPercent || 0;
  const discount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const orderPackage = getOrderPackage({ items });
  const shippingRate = await getShiprocketShippingRate({
    deliveryPostcode: body.customer?.postalCode || body.postalCode,
    weight: orderPackage.weight,
    cod: paymentMethod === 'cod',
    declaredValue: subtotal - discount,
  });
  const freeShipping = isFreeShippingEligible({ subtotal, paymentMethod });
  const shipping = freeShipping ? 0 : shippingRate.rate;

  return {
    items,
    subtotal,
    discount,
    shipping,
    total: Math.max(Number((subtotal - discount + shipping).toFixed(2)), 0),
    paymentMethod,
    package: orderPackage,
    shippingRate,
    freeShipping,
    coupon,
  };
};

export const quoteCheckout = async (body) => {
  if (!/^\d{6}$/.test(String(body.postalCode || '').trim())) {
    throw createError('Enter a valid 6 digit PIN code');
  }

  const pricing = await buildOrderPricing({
    ...body,
    customer: {
      postalCode: body.postalCode,
      email: body.email,
      phone: body.phone,
    },
  });

  return {
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping: pricing.shipping,
    total: pricing.total,
    couponCode: pricing.coupon?.couponCode || '',
    couponDiscountPercent: pricing.coupon?.discountPercent || 0,
    freeShipping: pricing.freeShipping,
    courierCompanyId: pricing.shippingRate.courierCompanyId,
    courierName: pricing.shippingRate.courierName,
    estimatedDeliveryDays: pricing.shippingRate.estimatedDeliveryDays,
  };
};

export const createOrder = async (body) => {
  validateCustomer(body.customer);
  const pricing = await buildOrderPricing(body);

  const order = await Order.create({
    orderNumber: createOrderNumber(),
    customer: body.customer,
    items: pricing.items,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping: pricing.shipping,
    total: pricing.total,
    couponCode: pricing.coupon?.couponCode || '',
    couponDiscountPercent: pricing.coupon?.discountPercent || 0,
    paymentMethod: pricing.paymentMethod,
    paymentStatus: 'pending',
    orderStatus: pricing.paymentMethod === 'razorpay' ? 'payment_initiated' : 'pending',
    status: 'pending',
    package: pricing.package,
    courierCompanyId: pricing.shippingRate.courierCompanyId,
    courierName: pricing.shippingRate.courierName,
  });

  if (pricing.paymentMethod !== 'razorpay') {
    return { order };
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: order.total,
    receipt: order.orderNumber,
    notes: {
      internalOrderId: String(order._id),
      orderNumber: order.orderNumber,
    },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    order,
    razorpayOrder,
    razorpayKeyId: getPublicRazorpayKey(),
  };
};

export const saveShiprocketResult = async (order, shiprocketResponse) => {
  if (!shiprocketResponse) return order;

  Object.entries(extractShipmentFields(shiprocketResponse)).forEach(([key, value]) => {
    if (value !== '') order[key] = value;
  });
  order.shiprocketError = '';
  order.orderStatus = 'shiprocket_order_created';
  order.status = 'confirmed';
  await order.save();
  return order;
};

export const createShipmentForPaidOrder = async (order) => {
  if (order.shiprocketShipmentId) return order;

  try {
    const shiprocketResponse = await createShiprocketOrder(order);
    return saveShiprocketResult(order, shiprocketResponse);
  } catch (error) {
    order.orderStatus = 'shipping_pending';
    order.status = 'confirmed';
    order.shiprocketError = error.message || 'Shiprocket order creation failed';
    await order.save();
    console.error(`Shiprocket pending for order ${order.orderNumber}`, error);
    return order;
  }
};

export const verifyPayment = async (body) => {
  const { orderId, razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature } = body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw createError('Payment verification details are required');
  }

  const order = await Order.findById(orderId);
  if (!order) throw createError('Order not found', 404);
  if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
    throw createError('Razorpay order mismatch');
  }

  const isValid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!isValid) throw createError('Razorpay signature mismatch');

  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.orderStatus = 'confirmed';
    order.status = 'confirmed';
    await order.save();
  }

  return createShipmentForPaidOrder(order);
};

export const markPaymentCaptured = async ({ razorpayOrderId, razorpayPaymentId }) => {
  if (!razorpayOrderId) return null;
  const order = await Order.findOne({ razorpayOrderId });
  if (!order) return null;

  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpayPaymentId || order.razorpayPaymentId;
    order.orderStatus = 'confirmed';
    order.status = 'confirmed';
    await order.save();
  }

  return createShipmentForPaidOrder(order);
};

export const markPaymentFailed = async ({ razorpayOrderId, razorpayPaymentId }) => {
  if (!razorpayOrderId) return null;
  const order = await Order.findOne({ razorpayOrderId });
  if (!order || order.paymentStatus === 'paid') return order;

  order.paymentStatus = 'failed';
  order.razorpayPaymentId = razorpayPaymentId || order.razorpayPaymentId;
  await order.save();
  return order;
};

export const markRefundProcessed = async ({ razorpayPaymentId }) => {
  if (!razorpayPaymentId) return null;
  const order = await Order.findOne({ razorpayPaymentId });
  if (!order) return null;

  order.paymentStatus = 'refunded';
  order.orderStatus = 'refunded';
  await order.save();
  return order;
};

export const listOrders = async ({ page = 1, limit = 20, search = '', paymentStatus = '', orderStatus = '' } = {}) => {
  const filter = {};
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (orderStatus) filter.orderStatus = orderStatus;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } },
      { razorpayPaymentId: { $regex: search, $options: 'i' } },
      { shiprocketShipmentId: { $regex: search, $options: 'i' } },
    ];
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page: currentPage,
      pages: Math.max(Math.ceil(total / perPage), 1),
      total,
    },
  };
};

export const retryShiprocket = async (orderId) => {
  if (!mongoose.isValidObjectId(orderId)) throw createError('Invalid order id');
  const order = await Order.findById(orderId);
  if (!order) throw createError('Order not found', 404);
  if (order.paymentStatus !== 'paid') throw createError('Only paid orders can be sent to Shiprocket');
  if (order.shiprocketShipmentId) throw createError('Shiprocket shipment already exists');

  const shiprocketResponse = await createShiprocketOrder(order);
  return saveShiprocketResult(order, shiprocketResponse);
};
