import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature,
  getKeyId,
} from '../config/razorpay.js';
import { getProductById } from '../data/products.js';

const router = Router();

// Store processed payment IDs in-memory to prevent replay attacks / duplicate callbacks
const processedPayments = new Set<string>();

interface CartItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderRequest {
  items: CartItemInput[];
  shippingMethod?: 'standard' | 'express';
  couponCode?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  notes?: string;
}

/**
 * POST /api/payments/create-order
 * Validates cart items against trusted database, computes price, tax & shipping,
 * and creates a Razorpay Test Mode order.
 */
router.post('/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shippingMethod = 'standard', couponCode, customer, notes } = req.body as CreateOrderRequest;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid order: items must be a non-empty array',
      });
      return;
    }

    // 1. Calculate subtotal strictly from trusted product catalog (never trust browser prices)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        res.status(400).json({
          success: false,
          error: `Invalid item format for product ID: ${item.productId}`,
        });
        return;
      }

      const product = getProductById(item.productId);
      if (!product) {
        res.status(400).json({
          success: false,
          error: `Unrecognized product in atelier catalog: ${item.productId}`,
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      validatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 2. Shipping calculation: Free standard if subtotal >= 5000, else 250. Express is 499.
    const isFreeStandard = subtotal >= 5000;
    const shippingFee = shippingMethod === 'express' ? 499 : isFreeStandard ? 0 : 250;

    // 3. Tax calculation: 5% GST on luxury textiles
    const tax = Math.round(subtotal * 0.05);

    // 4. Coupon discount
    let discount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'LUXURY10') {
        discount = Math.round(subtotal * 0.1);
      } else if (code === 'FIRST1000') {
        discount = 1000;
      }
    }

    // 5. Final order amount in INR & Paise
    const finalTotal = Math.max(0, subtotal + shippingFee + tax - discount);
    const amountInPaise = Math.round(finalTotal * 100);

    const breakdown = {
      subtotal,
      shippingFee,
      tax,
      discount,
      total: finalTotal,
      amountInPaise,
    };

    const razorpay = getRazorpayInstance();

    // If Razorpay live test credentials are configured in server/.env, call official SDK
    if (razorpay) {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
          clientName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim().slice(0, 45),
          clientEmail: (customer?.email || '').slice(0, 45),
          clientPhone: (customer?.phone || '').slice(0, 20),
          atelierNote: (notes || 'Haute Modesty Acquisition').slice(0, 80),
        },
      });

      res.status(200).json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: getKeyId(),
        breakdown,
        isSimulated: false,
      });
      return;
    }

    // In production, never fall back to simulated orders
    if (process.env.NODE_ENV === 'production') {
      res.status(503).json({
        success: false,
        error: 'Payment gateway credentials are not configured for live transactions.',
      });
      return;
    }

    // Fallback: If placeholder credentials are in server/.env, provide development test order
    // This allows complete frontend/backend checkout flow testing before keys are configured
    const simulatedOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    res.status(200).json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: getKeyId() || 'rzp_test_placeholder',
      breakdown,
      isSimulated: true,
      notice: 'Server running in development test simulator. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env for live Razorpay Test Mode.',
    });
  } catch (error: unknown) {
    let message = 'Failed to create payment order';
    let statusCode = 500;

    if (error && typeof error === 'object') {
      const rzpErr = error as { statusCode?: number; error?: { description?: string; code?: string }; message?: string };
      if (rzpErr.error?.description) {
        message = rzpErr.error.description;
      } else if (rzpErr.message) {
        message = rzpErr.message;
      }
      if (rzpErr.statusCode) {
        statusCode = rzpErr.statusCode;
      }
    }

    console.error(`[Razorpay Order Error] Status ${statusCode}: ${message}`);
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
});

/**
 * POST /api/payments/verify
 * Validates Razorpay signature. Marks order PAID only upon valid signature.
 */
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        paymentStatus: 'FAILED',
        error: 'Missing required payment verification parameters (order_id, payment_id, signature)',
      });
      return;
    }

    // 1. Check for duplicate/replay callback
    if (processedPayments.has(razorpay_payment_id)) {
      res.status(200).json({
        success: true,
        paymentStatus: 'PAID',
        message: 'Payment has already been verified and processed.',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        isDuplicate: true,
      });
      return;
    }

    // 2. Perform official cryptographic HMAC SHA256 signature verification
    if (isRazorpayConfigured()) {
      let isValid = false;
      try {
        isValid = verifyRazorpaySignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );
      } catch {
        isValid = false;
      }

      if (isValid) {
        processedPayments.add(razorpay_payment_id);
        res.status(200).json({
          success: true,
          paymentStatus: 'PAID',
          message: 'Razorpay Test Mode payment verified successfully.',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          verifiedAt: new Date().toISOString(),
        });
        return;
      } else {
        res.status(400).json({
          success: false,
          paymentStatus: 'FAILED',
          error: 'Cryptographic signature mismatch. Payment verification failed. Order will not be marked as PAID.',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        });
        return;
      }
    }

    // In production, never allow simulated verification
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        paymentStatus: 'FAILED',
        error: 'Simulation mode is strictly disabled in production. Valid Razorpay credentials required.',
      });
      return;
    }

    // 3. Fallback for simulated development test mode (when placeholder keys are in use)
    if (razorpay_signature === 'mock_invalid_signature' || razorpay_signature === 'fail') {
      res.status(400).json({
        success: false,
        paymentStatus: 'FAILED',
        error: 'Simulated payment verification failure. Order not marked as PAID.',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return;
    }

    // Valid simulated test payment
    processedPayments.add(razorpay_payment_id);
    res.status(200).json({
      success: true,
      paymentStatus: 'PAID',
      message: 'Simulated payment verified successfully in development test mode.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      isSimulated: true,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error verifying payment';
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      paymentStatus: 'FAILED',
      error: message,
    });
  }
});

/**
 * POST /api/payments/webhook
 * Handles asynchronous Razorpay webhook events (e.g. payment.captured, payment.failed)
 */
router.post('/webhook', (req: Request, res: Response): void => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!webhookSecret) {
    // If webhook secret is not configured, acknowledge receipt for local testing
    res.status(200).json({ status: 'webhook_received_unconfigured' });
    return;
  }

  if (!signature) {
    res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    return;
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(signature, 'utf-8');

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    const event = req.body;
    const eventType = event?.event || 'unknown';
    console.log(`[Razorpay Webhook] Received verified event: ${eventType}`);

    res.status(200).json({ status: 'success', event: eventType });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Webhook processing error';
    res.status(500).json({ error: msg });
  }
});

export default router;
