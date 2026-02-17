import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Order Placed"
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    payment: {
        type: Boolean,
        required: true,
        default: false,
    },
    // Khalti payment fields
    pidx: {
        type: String,
        default: null,
    },
    transactionId: {
        type: String,
        default: null,
    },
    khaltiSignature: {
        type: String,
        default: null,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'User canceled', 'N/A'],
        default: 'N/A',
    },
    paymentDetails: {
        type: Object,
        default: null,
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;