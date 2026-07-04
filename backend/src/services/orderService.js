import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

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

export const createOrder = async (body) => {
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

  const items = productIds.map((productId) => {
    const product = productMap.get(productId);
    const quantity = quantityByProduct.get(productId);

    if (!product) throw createError('One or more products are no longer available');
    if (!quantity) throw createError('Product quantity must be at least 1');
    if (product.stock < quantity) throw createError(`${product.name} does not have enough stock`);

    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 79;

  return Order.create({
    orderNumber: createOrderNumber(),
    customer: body.customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod: 'cod',
  });
};
