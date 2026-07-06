import { verifyWebhookSignature } from '../services/razorpayService.js';
import * as orderService from '../services/orderService.js';

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      res.status(400);
      throw new Error('Webhook raw body is required');
    }

    if (!verifyWebhookSignature(rawBody, signature)) {
      res.status(400);
      throw new Error('Invalid Razorpay webhook signature');
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const payment = event.payload?.payment?.entity;
    const razorpayOrder = event.payload?.order?.entity;
    const refund = event.payload?.refund?.entity;

    if (event.event === 'payment.captured') {
      await orderService.markPaymentCaptured({
        razorpayOrderId: payment?.order_id,
        razorpayPaymentId: payment?.id,
      });
    }

    if (event.event === 'order.paid') {
      await orderService.markPaymentCaptured({
        razorpayOrderId: razorpayOrder?.id,
        razorpayPaymentId: payment?.id,
      });
    }

    if (event.event === 'payment.failed') {
      await orderService.markPaymentFailed({
        razorpayOrderId: payment?.order_id,
        razorpayPaymentId: payment?.id,
      });
    }

    if (event.event === 'refund.processed') {
      await orderService.markRefundProcessed({
        razorpayPaymentId: refund?.payment_id || payment?.id,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
