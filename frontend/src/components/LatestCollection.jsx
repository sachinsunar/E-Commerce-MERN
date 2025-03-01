import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatestProducts(sortedProducts.slice(0, 10));
    }
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:texxt-sm md:text-base text-gray-600'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
        </p>
      </div>


      {/* Rendering Product */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6'>
        {latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No products available</p>
        )}
      </div>

    </div>
  )
}

export default LatestCollection