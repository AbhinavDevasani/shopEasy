import React from 'react';
import Hero from "./Hero";
import { Header } from './Navbar';
import Footer from './Footer';
import SampleProducts from './SampleProducts';
import { Link } from 'react-router-dom';
import Carousel from './Carousel';
function Home() {
  const categories = [
    "Fashion & Apparel",
    "Electronics",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Fitness"
  ];

  return (
    <div className="bg-[#f2f0f1]">

      <Hero />

      {/* CONTENT SECTION */}
      <div className="mt-10 space-y-16 px-6 lg:px-12 pb-20">
        <div>
          <h2 className="text-[#000000] text-3xl font-bold  uppercase">
            Explore Our Collection
          </h2>
          <div className="w-[30%] h-1 bg-[#000000] rounded my-5 mx-1"></div>
        </div>
        <Carousel />
        {categories.map((category, index) => (
          <section key={index} className="space-y-4 shadow-2xl py-6 px-8 rounded-lg ">
            <div className='flex justify-between gap-2'>
              <h1 className="text-[#1E293B] font-bold text-3xl md:text-4xl">
                {category}
              </h1>

            </div>

            <div className="w-16 h-1 bg-[#0EA5E9] rounded gap-2"></div>

            <SampleProducts category={category} />
            <div className='flex justify-center '>

              <Link to={`/shop?category=${encodeURIComponent(category)}`} className="px-5 py-2 rounded-lg bg-[#000000] my-5 cursor-pointer text-white font-medium hover:bg-gray-800 transition">
                Show More Related Products
              </Link>
            </div>
          </section>
        ))}

      </div>

      <Footer />

    </div>
  );
}

export default Home;
