import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image:
      "https://images.openai.com/static-rsc-3/AoyDIDyXvJW_tS-jXdpxEdq-EHxhFL3hdxIpqk7MfMGFcnd0KrYpz3cJHkOokNhUqW45uGXfe_b4jqKwxuCNXK1qm5GLwsbT5tGynoahoAk?purpose=fullsize&v=1",
    title: "Fashion & Apparel",
    description: "Discover the latest trends and timeless styles",
    category: "Fashion & Apparel",
  },
  {
    image:
      "https://images.openai.com/static-rsc-3/j_bSiUTGcP3aDYMc7zRgMU4YFgnQX95SoyD8r3zLGTmNrAROFA_3MGPDm52LGOTjFkFsALfhZdy06qlQdFE6PEB1sBw8uv3OiYolfbqHUp0?purpose=fullsize&v=1",
    title: "Electronics",
    description: "Smart gadgets built for modern living",
    category: "Electronics",
  },
  {
    image:
      "https://images.openai.com/static-rsc-3/bFVufxqnL9vsU0j4sVC3iuHnKBK3xgb9miFTIJM6dryHeh9AbcvEeUrN70tU4JeK0s8JOFQ-BXBqnqjspFEYuIjtfg9zRUrwJlLtCOuoAg8?purpose=fullsize&v=1",
    title: "Home & Kitchen",
    description: "Essentials that make your home smarter",
    category: "Home & Kitchen",
  },
  {
    image:
      "https://images.openai.com/static-rsc-3/R5HKS5xm8e9jG6SHubXGUu2btxT8I8GG8JhoLW3FYR2iUF6txQJP2TthN01YlJI2sZieXGRA70C0X4vY2T4_DAVunqVxRWWIfYp-ea5fQt0?purpose=fullsize&v=1",
    title: "Beauty & Personal Care",
    description: "Care that brings out your natural glow",
    category: "Beauty & Personal Care",
  },
  {
    image:
      "https://images.openai.com/static-rsc-3/Z8QzYsFN17jr-B9r22Upz2o4zaHEerVkGwrVwAzAVn0A_UOur7dPA-yu3wSszuMVNrS_R4OVu7Ru3WYELOh9p5ZP0UIqYgedJHedElv-xkg?purpose=fullsize&v=1",
    title: "Sports & Fitness",
    description: "Gear up to push your limits",
    category: "Sports & Fitness",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
  };

  const stopAutoSlide = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const handleNavigate = () => {
    const category = slides[current].category;
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg group cursor-pointer"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
      onClick={handleNavigate}
    >
      {/* SLIDES */}
      <div className="relative h-56 md:h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-white text-2xl md:text-4xl font-bold">
                {slide.title}
              </h2>
              <p className="mt-2 text-white/80 text-sm md:text-base max-w-xl">
                {slide.description}
              </p>
              <span className="mt-4 text-white text-sm underline">
                Shop now →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrent((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
          );
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
      >
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white">
          ❮
        </span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrent((prev) => (prev + 1) % slides.length);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
      >
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white">
          ❯
        </span>
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(index);
            }}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
