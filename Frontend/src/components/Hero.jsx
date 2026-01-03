import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <div>
      <div className="relative h-screen bg-linear-to-br from-muted to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <p className="text-blue-800 font-semibold text-sm mb-2">New Collection 2025</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                  Discover Premium Quality Products
                </h2>
                <p className="text-muted-foreground text-lg mt-4 text-balance">
                  Shop the latest trends and timeless classics curated just for you. Premium quality, affordable prices,
                  unbeatable service.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={"/shop"} className="bg-blue-900 text-white hover:bg-blue-800 text-primary-foreground px-8 py-6 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button className="bg-gray-200 hover:bg-gray-100 text-secondary-foreground px-8 py-6 rounded-lg font-semibold transition-all hover:shadow-lg">
                  Explore Deals
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex gap-6 pt-4">
                <div>
                  <p className="font-semibold text-foreground">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">30 Day</p>
                  <p className="text-sm text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-muted shadow-xl">
              <img
                src="https://res.cloudinary.com/dnx2ozxvd/image/upload/v1766051529/Screenshot_2025-12-09_182202_vglsyp.png"
                alt="Featured products"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
