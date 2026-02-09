import React from 'react'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import Loader from './Loader.jsx';
function SampleProducts({ category }) {
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchi = async () => {
      setLoading(true)
      const response = await fetch(`${API_URL}/product/productsbycategory/${category}?limit=4`);
      const data = await response.json()
      if (response.ok) {
        setProduct(data.products)
        setLoading(false)
      }
    }
    fetchi();
  }, [category])
  return (
    <>
      {loading && (
        <div className="flex justify-center my-20">
          <Loader />
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

        {product.map((i) => (
          <ProductCard key={i._id} product={i} />
        ))}

      </div>
    </>
  )
}

export default SampleProducts
