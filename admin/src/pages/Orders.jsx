import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { backendUrl, currency } from '../App';
import toast from 'react-hot-toast'
import assets from '../assets/assets';

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  console.log(orders);


  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {

      const res = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } })
      if (res.data.success) {
        setOrders(res.data.orders)

      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error)
      toast.error(res.data.message)
    }

  }

  const statusHandler = async (event, orderId) => {
    try {
      const res = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (res.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error(error.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])



  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h3 className="text-2xl mb-8">Order page</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-white p-6 border-l-4 border-gray-500 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <img src={order.items[0].image[0]} alt="Order" className="w-12 h-12" />
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-700">Order ID: {order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">Date: {order.createdAt.split("T")[0]}</p>
              </div>
              <p className="text-xl font-bold text-gray-800">{currency}{order.amount}</p>
            </div>
            <div className="mt-4">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-base text-gray-800 font-medium">
                  {item.name} x {item.quantity} <span className="text-gray-500">({item.size})</span>
                </p>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-semibold">{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}</p>
              <p>Phone: {order.address.phone}</p>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm border-t pt-4">
              <div>
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p className={`font-semibold ${order.payment ? "text-green-600" : "text-red-600"}`}>
                  Payment: {order.payment ? "Done" : "Pending"}
                </p>
              </div>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="border rounded-lg p-2 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders