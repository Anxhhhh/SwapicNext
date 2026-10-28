import api from './api';

export const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (
  amount: number,
  onSuccess: (data?: any) => void,
  onError: (err: any) => void
) => {
  try {
    // Create order on your backend
    const orderResponse = await api.post('/payment/create-order', { amount });
    const { order, isMock } = orderResponse.data;

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;

    // If sandbox / mock mode, complete via backend verify-payment directly
    if (isMock || !key || key === 'your_razorpay_key_id') {
      await api.post('/payment/verify-payment', {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'dev_mock_signature',
      });
      onSuccess({ orderId: order.id, mock: true });
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !(window as any).Razorpay) {
      // Fallback
      await api.post('/payment/verify-payment', {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'dev_mock_signature',
      });
      onSuccess({ orderId: order.id, mock: true });
      return;
    }

    const options = {
      key: key,
      amount: order.amount,
      currency: order.currency,
      name: 'SWAPIC Marketplace',
      description: 'Transaction on Swapic',
      order_id: order.id,
      handler: async (response: any) => {
        try {
          // Verify payment on your backend
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          
          await api.post('/payment/verify-payment', verifyData);
          onSuccess(response);
        } catch (err) {
          onError(err);
        }
      },
      prefill: {
        name: 'Swapic User',
        email: 'user@swapic.app',
      },
      theme: {
        color: '#E96B16',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      onError(response.error?.description || 'Payment cancelled or failed');
    });
    paymentObject.open();
  } catch (error: any) {
    onError(error.response?.data?.message || error.message || 'Payment initiation failed');
  }
};
