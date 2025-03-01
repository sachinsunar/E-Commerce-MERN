import express, { Router } from 'express'
import { placeOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();


//admin features
orderRouter.post("/list", adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateStatus)

//payment features
orderRouter.post("/place", authUser, placeOrder)

//User features
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter;