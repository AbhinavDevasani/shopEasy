import { useState, useMemo, useEffect } from "react"
import ProductCard from "./ProductCard"

import { useLocation } from "react-router-dom"
export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("Featured")
  const [products, setProducts] = useState([])
  const API_URL = import.meta.env.VITE_API_URL;
  
  /* 🔹 Pagination state */
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCTS_PER_PAGE = 6
 

 const location = useLocation()

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_URL}/product/products`)
      const data = await res.json()
      setProducts(data.products)
    }
    fetchProduct()
  }, [])
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryFromURL = params.get("category")

    if (categoryFromURL) {
        setSelectedCategory(categoryFromURL)
    }
  }, [location.search])

  // Extract categories dynamically
  const categories = ["All", ...new Set(products.map(p => p.category))]

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (searchQuery) {
        const q = searchQuery.toLowerCase()
        filtered = filtered.filter(p =>
            `${p.title} ${p.category}`.toLowerCase().includes(q)
        )
    }


    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : Infinity
    filtered = filtered.filter(p => p.price >= min && p.price <= max)

    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating)
    }

    if (sortBy === "Price: Low to High") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "Price: High to Low") {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, minRating, sortBy])

  /* 🔹 Reset page when filters change */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, minPrice, maxPrice, minRating, sortBy])

  /* 🔹 Pagination calculations */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setMinPrice("")
    setMaxPrice("")
    setMinRating(0)
    setSortBy("Featured")
    setCurrentPage(1)
  }

  return (
    <div className="bg-gray-50">
        <div className="m-5 font-mono">
            <h1 className="text-black text-4xl font-bold">Shop All Products</h1>
            <p className="text-black text-2xl">Discover our complete collection of premium items</p>
            <div className="bg-black w-[40%]"></div>
        </div>
        
        
      <div className="flex items-start mx-auto p-4 gap-6">
        
      

        {/* Filters */}
        <aside className="w-72 bg-white p-4 mt-10 rounded border">
          <h2 className="font-semibold mb-3">Filters</h2>

          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border p-2 mb-3"
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full border p-2 mb-3"
          >
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-full border p-2 mb-2"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full border p-2 mb-3"
          />

          <select
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className="w-full border p-2 mb-3"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={3}>3★ & above</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full border p-2 mb-3"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>

          <button
            onClick={clearFilters}
            className="w-full bg-black text-white py-2"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products */}
        <main className="flex-1">
          <p className="mb-4 text-sm text-gray-600">
            {filteredProducts.length} products found
          </p>

          {paginatedProducts.length === 0 ? (
            <div className="bg-white p-10 text-center border rounded">
              <h3 className="font-semibold mb-2">No products found</h3>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-4 py-2"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <div
                    key={product._id || product.id}
                    className="bg-white border rounded p-4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* 🔹 Pagination UI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 border disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border ${
                        currentPage === i + 1 ? "bg-black text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 border disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
