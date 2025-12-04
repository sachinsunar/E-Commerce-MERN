import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.post(backendUrl + `/api/product/list`)
      if (res.data.success) {
        setList(res.data.products)
      } else {

        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const removeProduct = async (id) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(`${backendUrl}/api/product/remove/${id}`, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message)
        fetchList();
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setDeletingId(null); 
    }
  }



  useEffect(() => {
    fetchList()
  }, [])



  return (
    <>
      <p className='mb-2 '>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* -----------list table title--------------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Images</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>


        {/* -----------product list---------- */}
        {
          list.map((item) => (
            <div className='grid grid-cols[1fr_3fr_1fr] md: grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py border text-sm' key={item._id}>
              <img className='w-12 h-12 object-cover rounded-md' src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>Rs.{item.price}</p>
              <div className='flex justify-center gap-4 items-center'>
                 {deletingId === item._id ? (
                  <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500"></div>
                  </button>
                ) : (
                  <img
                    onClick={() => navigate(`/edit/${item._id}`)}
                    className='w-6 h-6 cursor-pointer hover:opacity-80 transition'
                    src={assets.edit_icon}
                    alt="Edit"
                  />
                )}

                {deletingId === item._id ? (
                  <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500"></div>
                  </button>
                ) : (
                  <img
                    onClick={() => removeProduct(item._id)}
                    className='w-6 h-6 cursor-pointer hover:opacity-80 transition'
                    src={assets.delete_icon}
                    alt="Delete"
                  />
                )}
                
              </div>
            </div>
          ))
        }



      </div>
    </>
  )
}

export default List