import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import toast from 'react-hot-toast'
const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loader


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {

      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller ? "true" : "false");
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const res = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })


      if (res.data.success) {
        toast.success(res.data.message);
        setName('')
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      }
      else {
        toast.error(res.data.message)
      }



    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        toast.error(error.response.data.message || "Something went wrong!");
      } else {
        toast.error("Network error, please try again!");
      }
    }
    finally {
      setLoading(false); // Stop loading after request completes
    }
  }


  useEffect(() => {
    return () => {
      if (image1) URL.revokeObjectURL(image1);
      if (image2) URL.revokeObjectURL(image2);
      if (image3) URL.revokeObjectURL(image3);
      if (image4) URL.revokeObjectURL(image4);
    };
  }, [image1, image2, image3, image4]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
      </div>

      <div className='flex gap-2 '>
        <label htmlFor="image1">
          <img className='w-20' src={!image1 ? assets.upload_area : window.URL.createObjectURL(image1)} alt="" />
          <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
        </label>

        <label htmlFor="image2">
          <img className='w-20' src={!image2 ? assets.upload_area : window.URL.createObjectURL(image2)} alt="" />
          <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
        </label>

        <label htmlFor="image3">
          <img className='w-20' src={!image3 ? assets.upload_area : window.URL.createObjectURL(image3)} alt="" />
          <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
        </label>

        <label htmlFor="image4">
          <img className='w-20' src={!image4 ? assets.upload_area : window.URL.createObjectURL(image4)} alt="" />
          <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
        </label>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-2 py-2' type="text" placeholder='Enter product name ' required name="" id="" />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product desciption</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-2 py-2' type="text" placeholder='Write content here' required name="" id="" />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 '>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 ' name="" id="">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 ' name="" id="">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Set">Set</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='Enter Price ' required name="" id="" />
        </div>
      </div>

      <div>
        <p>Product Sizes</p>
        <div className='flex gap-3'>

          <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== 'S') : [...prev, 'S'])}>
            <p className={` ${sizes.includes('S') ? 'bg-pink-100' : 'bg-slate-200'} px-3 cursor-pointer`}>S</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== 'M') : [...prev, 'M'])}>
            <p className={` ${sizes.includes('M') ? 'bg-pink-100' : 'bg-slate-200'} px-3 cursor-pointer`}>M</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== 'L') : [...prev, 'L'])}>
            <p className={` ${sizes.includes('L') ? 'bg-pink-100' : 'bg-slate-200'} px-3 cursor-pointer`}>L</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== 'XL') : [...prev, 'XL'])}>
            <p className={` ${sizes.includes('XL') ? 'bg-pink-100' : 'bg-slate-200'} px-3 cursor-pointer`}>XL</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== 'XXL') : [...prev, 'XXL'])}>
            <p className={` ${sizes.includes('XXL') ? 'bg-pink-100' : 'bg-slate-200'} px-3 cursor-pointer`}>XXL</p>
          </div>

        </div>
      </div>


      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => {
            setBestseller(prev => !prev);
            console.log("Updated Bestseller:", !bestseller);
          }}
          checked={bestseller}
          className='cursor-pointer'
          type="checkbox"
          id="bestseller"
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>



      <button type='submit' disabled={loading} className={`w-28 py-2 mt-4 text-white cursor-pointer  ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'}`}>
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          "Add"
        )}
      </button>


    </form>
  )
}

export default Add