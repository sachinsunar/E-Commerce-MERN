import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

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


export { placeOrder, allOrders, userOrders, updateStatus }