import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import {
  CreditCard,
  Smartphone,
  Building,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';

interface RazorpayModalProps {
  amount: number;
  orderNumber: string;
  razorpayOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (reason: string) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  amount,
  orderNumber,
  razorpayOrderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const handleSimulatePayment = (scenario: 'success' | 'fail' | 'tampered_signature') => {
    setIsProcessing(true);
    setProcessingStatus('Connecting to Razorpay Test Gateway...');

    setTimeout(() => {
      setIsProcessing(false);

      if (scenario === 'fail') {
        onFailure('Customer payment failed: Test transaction cancelled by bank or user declined authorization.');
        return;
      }

      const testPaymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`;

      if (scenario === 'tampered_signature') {
        // Send a tampered signature to test backend signature rejection
        onSuccess({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: 'fail',
        });
        return;
      }

      // Successful test payment
      onSuccess({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: 'mock_valid_signature',
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[#171614]/80 backdrop-blur-xs" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden border border-[#171614]/20">
          {/* Razorpay Brand Header */}
          <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#3395FF] flex items-center justify-center font-bold text-white text-base shadow-xs">
                R
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-sm tracking-wide">Razorpay Checkout</span>
                  <span className="text-[9px] bg-[#3395FF] text-white px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-bold">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-white/70">
                  Abaya Attire Official • #{orderNumber}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount banner */}
          <div className="bg-[#F4F7FB] px-5 py-3.5 border-b border-[#0C2340]/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#0C2340]/70 uppercase tracking-wider font-medium block">
                Total Payable Amount
              </span>
              <span className="text-xl font-bold text-[#0C2340]">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="text-right text-[10px] text-gray-500 font-mono">
              Order ID: <span className="font-semibold text-gray-800">{razorpayOrderId.slice(-10)}</span>
            </div>
          </div>

          {/* Notice banner */}
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-start space-x-2 text-[11px] text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Razorpay Test Mode Active:</strong> Test payment simulation with backend signature verification. No real money or card balance will be debited.
            </p>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 text-xs">
            <button
              type="button"
              onClick={() => setSelectedTab('upi')}
              className={`py-3 flex flex-col items-center justify-center font-medium border-b-2 transition-colors ${
                selectedTab === 'upi'
                  ? 'border-[#3395FF] text-[#0C2340] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone className="w-4 h-4 mb-1 text-[#3395FF]" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('card')}
              className={`py-3 flex flex-col items-center justify-center font-medium border-b-2 transition-colors ${
                selectedTab === 'card'
                  ? 'border-[#3395FF] text-[#0C2340] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4 mb-1 text-[#3395FF]" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('netbanking')}
              className={`py-3 flex flex-col items-center justify-center font-medium border-b-2 transition-colors ${
                selectedTab === 'netbanking'
                  ? 'border-[#3395FF] text-[#0C2340] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building className="w-4 h-4 mb-1 text-[#3395FF]" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Tab content */}
          <div className="p-5 space-y-4">
            {selectedTab === 'upi' && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-xs space-y-1">
                  <div className="font-semibold text-gray-800">Test VPA Address:</div>
                  <div className="font-mono text-gray-600 bg-white p-1.5 border border-gray-200">
                    success@razorpay
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Pre-filled with customer: {customerName} ({customerPhone || customerEmail})
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'card' && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-xs space-y-1">
                  <div className="font-semibold text-gray-800">Razorpay Test Card:</div>
                  <div className="font-mono text-gray-600 bg-white p-1.5 border border-gray-200">
                    4111 1111 1111 1111
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 pt-1 font-mono">
                    <span>Expiry: 12/28</span>
                    <span>CVV: 123</span>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'netbanking' && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-xs text-gray-600">
                <span>Select Test Bank: <strong>HDFC Bank / ICICI Bank (Test Mode)</strong></span>
              </div>
            )}

            {/* Test Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulatePayment('success')}
                className="w-full bg-[#3395FF] hover:bg-[#2080ea] disabled:bg-gray-300 text-white py-3 px-4 rounded-sm text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                {isProcessing ? (
                  <span>{processingStatus}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize Test Payment ({formatCurrency(amount)})</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('fail')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 px-2.5 rounded-sm flex items-center justify-center space-x-1.5 transition-colors font-medium cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Simulate Failed Payment</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('tampered_signature')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-2 px-2.5 rounded-sm flex items-center justify-center space-x-1.5 transition-colors font-medium cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Test Signature Tamper</span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 text-center pt-1">
              Secured by Razorpay Technologies • 256-bit TLS Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
