import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";

const PlaceOrder = () => {

   const [method, setMethod] = useState('cod');
   const { navigate, backendUrl, token, cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopContext);
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: '',
   })

   const onchangeHandler = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setFormData(data => ({ ...data, [name]: value }))
   }

   const onSubmitHandler = async (e) => {
      e.preventDefault();
      try {
         let orderItems = []
         for (const items in cartItem) {
            for (const item in cartItem[items]) {
               if (cartItem[items][item] > 0) {
                  const itemInfo = structuredClone(products.find(product => product._id === items))
                  if (itemInfo) {
                     itemInfo.size = item
                     itemInfo.quantity = cartItem[items][item]
                     orderItems.push(itemInfo)
                  }
               }
            }
         }

         let orderData = {
            address: { ...formData },
            items: orderItems,
            amount: getCartAmount() + delivery_fee
         }


         switch (method) {

            //API calls for COD
            case 'cod':
               const res = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
               if (res.data.success) {
                  setCartItem({})
                  navigate('/orders')
               } else {
                  toast.error(res.data.message)
               }
               break;

            default:
               break;

         }

      } catch (error) {
         console.log(error);
         toast.error(error.message);
      }
   }





   return (
      <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t ">
         {/* ----------left side------------- */}
         <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">

            <div className="text-xl sm:text-2xl my-3">
               <Title text1={'DELIVERY'} text2={'INFORMATION'} />
            </div>

            <div className="flex gap-3">
               <input required onChange={onchangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />

               <input required onChange={onchangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
            </div>

            <input required onChange={onchangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />

            <input required onChange={onchangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />

            <div className="flex gap-3">
               <input required onChange={onchangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City " />
               <input required onChange={onchangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State " />
            </div>
            <div className="flex gap-3">
               <input required onChange={onchangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
               <input required onChange={onchangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country " />
            </div>
            <input required onChange={onchangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone " />
         </div>

         {/* ----------Right Side---------------- */}
         <div className="mt-8">
            <div className="mt-8 min-w-80">
               <CartTotal />
            </div>

            <div className="mt-12">
               <Title text1={'PAYMENT'} text2={'METHOD'} />

               {/* ----------------payment method-------------- */}
               <div className="flex gap-4 flex-col lg:flex-row ">
                  <div onClick={() => setMethod('esewa')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                     <p className={`in w-3.5 h-3.5 border rounded-full  ${method === 'esewa' ? 'bg-green-400' : ''}`}></p>
                     <img className="h-5  mx-4" src={assets.esewa_logo} />
                  </div>
                  <div onClick={() => setMethod('imepay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                     <p className={`min w-3.5 h-3.5 border rounded-full ${method === 'imepay' ? 'bg-green-400' : ''}`}></p>
                     <img className="h-5  mx-2" src={assets.imepay} />
                  </div>

                  <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                     <p className={`min w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                     <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                  </div>
               </div>
            </div>

            <div className="w-full text-end mt-8">
               <button type="submit" className="bg-black text-white px-16 py-3 text-sm cursor-pointer">PLACE ORDER</button>
            </div>
         </div>

      </form>
   )
};

export default PlaceOrder;
