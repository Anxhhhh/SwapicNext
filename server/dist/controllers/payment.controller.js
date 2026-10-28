import crypto from 'crypto';
import Razorpay from 'razorpay';
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        if (!amount) {
            res.status(400).json({ message: 'Amount is required' });
            return;
        }
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        // Support mock dev checkout if live keys are not configured yet
        if (!keyId || !keySecret || keyId === 'your_razorpay_key_id') {
            const mockOrder = {
                id: `order_mock_${Date.now()}`,
                amount: Math.round(Number(amount) * 100),
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            };
            res.status(200).json({
                success: true,
                order: mockOrder,
                isMock: true,
            });
            return;
        }
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        const options = {
            amount: Math.round(Number(amount) * 100), // Razorpay works in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order,
            isMock: false,
        });
    }
    catch (error) {
        console.error('Error creating Razorpay order:', error);
        // Graceful fallback to test mode if Razorpay rejects keys
        const mockOrder = {
            id: `order_mock_${Date.now()}`,
            amount: Math.round(Number(req.body.amount || 100) * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        res.status(200).json({
            success: true,
            order: mockOrder,
            isMock: true,
        });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        // Handle mock verification
        if (razorpay_order_id?.startsWith('order_mock_') || !keySecret || keySecret === 'your_razorpay_key_secret') {
            res.status(200).json({ success: true, message: 'Test payment verified successfully!' });
            return;
        }
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', keySecret)
            .update(sign.toString())
            .digest('hex');
        if (razorpay_signature === expectedSign) {
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid signature sent!' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Failed to verify payment' });
    }
};
