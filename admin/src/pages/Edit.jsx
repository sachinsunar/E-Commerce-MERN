import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import toast from 'react-hot-toast'
import ImageInput from '../components/ImageInput'

const Edit = ({ token }) => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  // Store existing image URLs
  const [existingImages, setExistingImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);


  const [removeImages, setRemoveImages] = useState({
    image1: false,
    image2: false,
    image3: false,
    image4: false
  });


  const fetchSingleProduct = async () => {
    try {
      const res = await axios.post(backendUrl + `/api/product/single/${id}`, {}, { headers: { token } })
      if (res.data.success) {
        const product = res.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);
        setSizes(product.sizes);

        // Store existing images
        setExistingImages({
          image1: product.image?.[0] || null,
          image2: product.image?.[1] || null,
          image3: product.image?.[2] || null,
          image4: product.image?.[3] || null
        });
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    if (id && token) {
      fetchSingleProduct();
    }
  }, [id, token]);

 const onSubmitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestseller ? "true" : "false");
    formData.append("sizes", JSON.stringify(sizes));

    // NEW → send remove flags
    formData.append("removeImages", JSON.stringify(removeImages));

    // Append new images if selected
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);

    const res = await axios.put(
      `${backendUrl}/api/product/update/${id}`,
      formData,
      { headers: { token } }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      navigate('/list');
    } else {
      toast.error(res.data.message);
    }

  } catch (error) {
    toast.error("Error updating product");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    return () => {
      if (image1 && typeof image1 !== 'string') URL.revokeObjectURL(image1);
      if (image2 && typeof image2 !== 'string') URL.revokeObjectURL(image2);
      if (image3 && typeof image3 !== 'string') URL.revokeObjectURL(image3);
      if (image4 && typeof image4 !== 'string') URL.revokeObjectURL(image4);
    };
  }, [image1, image2, image3, image4]);

  if (fetchLoading) {
    return <div className="flex justify-center items-center h-screen">Loading product...</div>;
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
      </div>

      <div className='flex gap-3'>
        <ImageInput
          label="image1"
          imgKey="image1"
          image={image1}
          setImage={setImage1}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          removeImages={removeImages}
          setRemoveImages={setRemoveImages}
        />

        <ImageInput
          label="image2"
          imgKey="image2"
          image={image2}
          setImage={setImage2}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          removeImages={removeImages}
          setRemoveImages={setRemoveImages}
        />

        <ImageInput
          label="image3"
          imgKey="image3"
          image={image3}
          setImage={setImage3}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          removeImages={removeImages}
          setRemoveImages={setRemoveImages}
        />

        <ImageInput
          label="image4"
          imgKey="image4"
          image={image4}
          setImage={setImage4}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          removeImages={removeImages}
          setRemoveImages={setRemoveImages}
        />
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
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 ' name="" id="">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 ' name="" id="">
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
          onChange={() => setBestseller(prev => !prev)}
          checked={bestseller}
          className='cursor-pointer'
          type="checkbox"
          id="bestseller"
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' disabled={loading} className={`w-28 py-2 mt-4 text-white cursor-pointer ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'}`}>
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Updating...
          </span>
        ) : (
          "Update"
        )}
      </button>
    </form>
  )
}

export default Edit