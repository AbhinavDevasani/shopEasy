import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css"
function Hero() {
  return (
    <div>
            <div className="relative min-h-screen bg-[#f2f0f1] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <p className="text-blue-800 font-semibold text-sm">
                New Collection 2025
              </p>

              <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-black leading-tight">
                Discover Premium Quality Products
              </h2>

              <p className="text-gray-600 text-lg max-w-xl">
                Shop the latest trends and timeless classics curated just for you. Premium quality, affordable prices,
                unbeatable service.
              </p>

              {/* CTA BUTTONS */}
              <div className="flex gap-4">
                <Link
                  to="/shop"
                  className="bg-black text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-neutral-800 transition"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="border border-black px-8 py-4 rounded-full font-semibold hover:bg-black hover:text-white transition"
                >
                  Explore Deals
                </Link>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div>
                  <p className="text-2xl font-bold text-black">50K+</p>
                  <p className="text-sm text-gray-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">Free Shipping</p>
                  <p className="text-sm text-gray-500">On orders over $50</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">30 Day</p>
                  <p className="text-sm text-gray-500">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img
  src="https://res.cloudinary.com/dudjdf428/image/upload/v1770615978/ChatGPT_Image_Feb_9_2026_11_14_07_AM_wcmsno.png"
  alt="Featured products"
  className="w-full h-[75vh] object-contain drop-shadow-2xl"
/>
                
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="bg-black py-12 sm:py-16">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <h2 class="text-center text-lg font-semibold text-white">
      Trusted by the world's most innovative teams
    </h2>

    
    <div class="relative mt-8 overflow-hidden">
      
      
      <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black to-transparent z-10"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black to-transparent z-10"></div>

      <div class="flex w-max animate-scroll gap-16">
       
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />

        
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg" class="h-8 opacity-70 hover:opacity-100 transition" />
      </div>
    </div>
  </div>
</div>

    </div>
  );
}

export default Hero;
