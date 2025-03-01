import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {

    const bestProduct = products.filter((item) => item.bestseller === true);
    const sortedProducts = [...bestProduct].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setBestSeller(sortedProducts.slice(0, 5));
  }, [products])



  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className='w-3/4 m-auto text-xs  md:text-base text-gray-600'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta, ipsam.</p>
      </div>


      {/* Rendering Product */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6'>
        {bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No products available</p>
        )}
      </div>


    </div>
  )
}

export default BestSeller