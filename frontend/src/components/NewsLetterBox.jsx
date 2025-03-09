import React, { useState } from 'react'
import { backendUrl } from '../../../admin/src/App';
import axios from 'axios'
import { toast } from "react-hot-toast"

const NewsLetterBox = () => {

  const [subscriber, setSubscriber] = useState("")

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/user/subscriber", { email: subscriber })
      if (res.data.success) {
        toast.success(res.data.message)
        setSubscriber("");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong!");
      } else {
        toast.error("Something went wrong! Please try again.");
      }

    }
  }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, dicta.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' >
        <input onChange={(e) => setSubscriber(e.target.value)} className='w-full sm:flex-1 outline-none' type="email" value={subscriber} placeholder='Enter your e-mail' required />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetterBox