import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    sku: {
      type: String,
      trim: true,
      default: '',
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    tax: {
      type: Number,
      min: 0,
      default: 0,
    },
    hsn: {
      type: String,
      trim: true,
      default: '',
    },
    dimensions: {
      length: { type: Number, min: 0, default: 10 },
      breadth: { type: Number, min: 0, default: 10 },
      height: { type: Number, min: 0, default: 5 },
      weight: { type: Number, min: 0, default: 0.5 },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: 'Order must include at least one product',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'payment_initiated',
        'confirmed',
        'shipping_pending',
        'shiprocket_order_created',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: '',
    },
    shiprocketOrderId: {
      type: String,
      trim: true,
      default: '',
    },
    shiprocketShipmentId: {
      type: String,
      trim: true,
      default: '',
    },
    shiprocketStatus: {
      type: String,
      trim: true,
      default: '',
    },
    awbCode: {
      type: String,
      trim: true,
      default: '',
    },
    courierCompanyId: {
      type: String,
      trim: true,
      default: '',
    },
    courierName: {
      type: String,
      trim: true,
      default: '',
    },
    trackingUrl: {
      type: String,
      trim: true,
      default: '',
    },
    shiprocketError: {
      type: String,
      trim: true,
      default: '',
    },
    package: {
      length: { type: Number, min: 0.1, default: 10 },
      breadth: { type: Number, min: 0.1, default: 10 },
      height: { type: Number, min: 0.1, default: 5 },
      weight: { type: Number, min: 0.01, default: 0.5 },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
