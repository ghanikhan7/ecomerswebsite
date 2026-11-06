import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory path for both tsx dev and compiled dist execution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env regardless of process execution directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const getKeyId = (): string => (process.env.RAZORPAY_KEY_ID || '').trim();
export const getKeySecret = (): string => (process.env.RAZORPAY_KEY_SECRET || '').trim();

export const isPlaceholderKey = (key: string): boolean => {
  return !key || key.includes('your_key') || key.includes('placeholder') || key.trim() === '';
};

export const isRazorpayConfigured = (): boolean => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();
  return (
    Boolean(keyId) &&
    Boolean(keySecret) &&
    !isPlaceholderKey(keyId) &&
    !isPlaceholderKey(keySecret)
  );
};

export const logRazorpayDiagnostics = (): void => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();
  const isKeyIdPresent = Boolean(keyId);
  const startsWithTest = keyId.startsWith('rzp_test_');
  const isSecretPresent = Boolean(keySecret);

  console.log(`  [Razorpay Auth] Key ID present:          ${isKeyIdPresent}`);
  console.log(`  [Razorpay Auth] Key ID starts with rzp_test_: ${startsWithTest}`);
  console.log(`  [Razorpay Auth] Key Secret present:      ${isSecretPresent}`);
  if (isSecretPresent) {
    console.log(`  [Razorpay Auth] Key Secret length:       ${keySecret.length} characters`);
  }
};

export const getRazorpayInstance = (): Razorpay | null => {
  if (!isRazorpayConfigured()) {
    return null;
  }
  return new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret(),
  });
};

/**
 * Verifies Razorpay payment signature using HMAC SHA256
 * Signature formula: HMAC_SHA256(order_id + "|" + payment_id, secret)
 */
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const secret = getKeySecret();
  if (!secret || !signature || typeof signature !== 'string') return false;

  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
  const signatureBuffer = Buffer.from(signature, 'utf-8');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};
