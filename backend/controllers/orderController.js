import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import axios from 'axios'
import khaltiConfig from '../config/khalti.js'

//placing order using Cash On Delivery

const placeOrder = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            address,
            items,
            amount,
            paymentMethod: "COD",
            payment: false,
        }

        const newOrder = new Order(orderData)

        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Initiate Khalti Payment
const initiateKhaltiPayment = async (req, res) => {
    try {
        const { userId, items, amount, address, customerInfo } = req.body;

        // Create order in database first with pending status
        const orderData = {
            userId,
            address,
            items,
            amount,
            paymentMethod: "Khalti",
            payment: false,
            paymentStatus: "Pending",
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Prepare Khalti payment payload
        const khaltiPayload = {
            return_url: khaltiConfig.returnUrl,
            website_url: khaltiConfig.websiteUrl,
            amount: Math.round(amount * 100), // Convert to paisa (1 NPR = 100 paisa)
            purchase_order_id: newOrder._id.toString(),
            purchase_order_name: `Order #${newOrder._id.toString().slice(-6)}`,
            customer_info: {
                name: customerInfo?.name || `${address.firstName} ${address.lastName}`,
                email: customerInfo?.email || address.email,
                phone: customerInfo?.phone || address.phone
            }
        };

        // Call Khalti API to initiate payment
        const khaltiResponse = await axios.post(
            `${khaltiConfig.apiUrl}/epayment/initiate/`,
            khaltiPayload,
            {
                headers: {
                    'Authorization': `Key ${khaltiConfig.secretKey}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Update order with pidx
        await Order.findByIdAndUpdate(newOrder._id, {
            pidx: khaltiResponse.data.pidx
        });

        res.json({
            success: true,
            message: "Payment initiated",
            orderId: newOrder._id,
            payment_url: khaltiResponse.data.payment_url,
            pidx: khaltiResponse.data.pidx,
            expires_at: khaltiResponse.data.expires_at,
            expires_in: khaltiResponse.data.expires_in
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.response?.data?.message || error.message,
            error_details: error.response?.data
        });
    }
}

// Verify Khalti Payment
const verifyKhaltiPayment = async (req, res) => {
    try {
        const { pidx, purchase_order_id, transaction_id, amount, status } = req.body;

        // Lookup payment from Khalti
        const khaltiResponse = await axios.post(
            `${khaltiConfig.apiUrl}/epayment/lookup/`,
            { pidx },
            {
                headers: {
                    'Authorization': `Key ${khaltiConfig.secretKey}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const paymentData = khaltiResponse.data;

        // Update order with payment details
        const order = await Order.findById(purchase_order_id);
        
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Update order status based on payment status
        const paymentSuccess = paymentData.status === 'Completed';
        
        await Order.findByIdAndUpdate(purchase_order_id, {
            payment: paymentSuccess,
            paymentStatus: paymentData.status,
            transactionId: paymentData.transaction_id,
            khaltiSignature: JSON.stringify(paymentData),
            paymentDetails: {
                pidx: pidx,
                transaction_id: paymentData.transaction_id,
                amount: paymentData.total_amount,
                mobile: paymentData.mobile,
                fee: paymentData.fee,
                refunded: paymentData.refunded
            }
        });

        // Clear user cart if payment successful
        if (paymentSuccess) {
            await User.findByIdAndUpdate(order.userId, { cartData: {} });
        }

        res.json({
            success: true,
            verified: paymentSuccess,
            message: paymentSuccess ? "Payment verified successfully" : "Payment verification failed",
            paymentStatus: paymentData.status,
            order: order._id
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.response?.data?.message || error.message,
            error_details: error.response?.data
        });
    }
}


//All order data for admin panel
const allOrders = async (req, res) => {

    try {

        const orders = await Order.find({})
        res.json({ success: true, orders })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


//User order Data for frontend
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body;
        const orders = await Order.find({ userId })
        res.json({ success: true, orders })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//update orders Status from admin panel
const updateStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Staus Updated" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


export { placeOrder, initiateKhaltiPayment, verifyKhaltiPayment, allOrders, userOrders, updateStatus }