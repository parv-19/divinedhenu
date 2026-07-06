import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const quoteShipping = async (req, res, next) => {
  try {
    const quote = await orderService.quoteCheckout(req.body);
    res.status(200).json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const order = await orderService.verifyPayment(req.body);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const result = await orderService.listOrders(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const retryShiprocket = async (req, res, next) => {
  try {
    const order = await orderService.retryShiprocket(req.params.orderId);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
