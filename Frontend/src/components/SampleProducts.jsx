import React from 'react'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import Loader from './Loader.jsx';
function SampleProducts({category}) {
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(()=>{
    const fetchi = async()=>{
      setLoading(true)
      const response = await fetch(`${API_URL}/product/productsbycategory/${category}?limit=4`);
      const data = await response.json()
      if(response.ok){
        setProduct(data.products)
        setLoading(false)
      }
    }
    fetchi();
  },[category])
  return (
    <>
     {loading && (
        <div className="flex justify-center my-20">
          <Loader />
        </div>
      )}

    <div className='flex flex-wrap justify-between '>
      
      {product.map((i) => (
        <ProductCard key={i._id} product={i} />
      ))}

    </div>
    </>
  )
}

export default SampleProducts
