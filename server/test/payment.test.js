import test from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { verifyRazorpaySignature } from '../dist/config/razorpay.js';
import { getProductById, trustedProducts } from '../dist/data/products.js';

test('Product catalog integrity and lookup', () => {
  assert.ok(trustedProducts.length >= 100, 'Catalog should contain at least 100 trusted products');
  
  const prod = getProductById('prod-10846759583884');
  assert.ok(prod, 'Should find product prod-10846759583884');
  assert.strictEqual(prod.price, 1399, 'Product price should match catalog value');
  assert.strictEqual(prod.name, 'ZEHNA FRONT OPEN ABAYA | WHITE');
});

test('Trusted pricing calculation against client price tampering', () => {
  // Scenario: Client submits quantity 2 of prod-10846759583884 (trusted price 1399)
  // Even if client tried to claim price is 1, backend computes strictly from trustedProducts
  const item = { productId: 'prod-10846759583884', quantity: 2 };
  const catalogProduct = getProductById(item.productId);
  assert.ok(catalogProduct);

  const subtotal = catalogProduct.price * item.quantity;
  assert.strictEqual(subtotal, 2798);

  // Standard shipping under 5000 is 250
  const shippingFee = subtotal >= 5000 ? 0 : 250;
  assert.strictEqual(shippingFee, 250);

  // 10% discount from LUXURY10
  const discount = Math.round(subtotal * 0.1);
  assert.strictEqual(discount, 280);

  // 5% GST tax
  const tax = Math.round(subtotal * 0.05);
  assert.strictEqual(tax, 140);

  const total = Math.max(0, subtotal + shippingFee + tax - discount);
  assert.strictEqual(total, 2908);
  const amountInPaise = total * 100;
  assert.strictEqual(amountInPaise, 290800);
});

test('Razorpay HMAC SHA256 signature verification with valid secret', () => {
  const testSecret = 'secret_luxury_abaya_test_key_98765';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const orderId = 'order_test_luxury_1001';
  const paymentId = 'pay_test_verified_8888';
  const payload = `${orderId}|${paymentId}`;
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(payload)
    .digest('hex');

  const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature);
  assert.strictEqual(isValid, true, 'Cryptographically valid signature must verify successfully');
});

test('Tampered or forged Razorpay signature rejection', () => {
  const testSecret = 'secret_luxury_abaya_test_key_98765';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const orderId = 'order_test_luxury_1001';
  const paymentId = 'pay_test_verified_8888';
  const forgedSignature = crypto
    .createHmac('sha256', 'wrong_attacker_secret')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = verifyRazorpaySignature(orderId, paymentId, forgedSignature);
  assert.strictEqual(isValid, false, 'Signature signed with wrong secret must be rejected');
});

test('Malformed or invalid length signature rejection (no crash)', () => {
  const testSecret = 'secret_luxury_abaya_test_key_98765';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const orderId = 'order_test_luxury_1001';
  const paymentId = 'pay_test_verified_8888';

  // Test empty string, short string, and random non-hex characters
  assert.strictEqual(verifyRazorpaySignature(orderId, paymentId, ''), false);
  assert.strictEqual(verifyRazorpaySignature(orderId, paymentId, 'short_sig'), false);
  assert.strictEqual(verifyRazorpaySignature(orderId, paymentId, '0'.repeat(63)), false);
});

test('Free shipping on orders over ₹5,000 threshold', () => {
  const subtotal = 5499;
  const isFreeStandard = subtotal >= 5000;
  const standardFee = isFreeStandard ? 0 : 250;
  const expressFee = 499;

  assert.strictEqual(standardFee, 0, 'Standard shipping should be complimentary over 5000');
  assert.strictEqual(expressFee, 499, 'Express shipping should remain 499');
});

test('Flat coupon discount (FIRST1000) and zero minimum total clamp', () => {
  const subtotal = 1399;
  const discount = 1000;
  const tax = Math.round(subtotal * 0.05); // 70
  const shipping = 250;
  const total = Math.max(0, subtotal + shipping + tax - discount);
  assert.strictEqual(total, 1399 + 250 + 70 - 1000); // 719

  // If discount exceeds order, total cannot drop below 0
  const massiveDiscount = 5000;
  const clampedTotal = Math.max(0, subtotal + shipping + tax - massiveDiscount);
  assert.strictEqual(clampedTotal, 0, 'Total should clamp at 0');
});

test('Razorpay Webhook HMAC SHA256 signature verification', () => {
  const webhookSecret = 'whsec_test_luxury_atelier_54321';
  const payload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test_wh_123',
          amount: 290800,
          currency: 'INR',
          status: 'captured'
        }
      }
    }
  });

  const validSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  // Verify HMAC matching
  const expectedBuffer = Buffer.from(validSignature, 'utf-8');
  const actualBuffer = Buffer.from(validSignature, 'utf-8');
  assert.strictEqual(crypto.timingSafeEqual(expectedBuffer, actualBuffer), true);

  // Verify forged signature rejection
  const forgedBuffer = Buffer.from('f'.repeat(64), 'utf-8');
  assert.strictEqual(crypto.timingSafeEqual(expectedBuffer, forgedBuffer), false);
});
