import { useState } from "react";
import { Heart, ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import CartDrawer from "./Cart.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
export function Header({ setOpenCart, openCart, cartCount }) {
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate()

  const navItems = ["Home", "Shop", "About Us", "Contact"];
  const login = !!Cookies.get("Jwt_token");


  const handleLogout = () => {
    Cookies.remove("Jwt_token");
    navigate("/")
  };





  return (
    <>
      {showBanner && (
        <div className="relative flex items-center bg-black px-6 py-2.5 sm:px-3.5">
        <div className="mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">Super Sale 2026</strong>
            <span className="mx-2">•</span>
            Up to 50% off on selected items
          </p>

          <a
            href="/shop"
            className="flex-none rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Shop Now →
          </a>
        </div>

        <button
          type="button"
          className="absolute right-4 -m-3 p-3 text-white focus-visible:outline-offset-[-4px]"
          onClick={() => setShowBanner(false)}
        >
          <span className="sr-only">Dismiss</span>
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      )}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className=" mx-10 px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-20">
            <div className="flex w-[50%]">
              {/* Logo */}
              <div className="flex items-center gap-2 mr-10 shrink-0">
                <div className="w-9 h-9 bg-black rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">N</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  <span className="text-primary">Next</span>
                  <span className="text-foreground">Buy</span>
                </h1>
              </div>

            </div>

            <div className="flex gap-2">
              {/* Nav */}
              <nav className="flex gap-10 lg:gap-8 text-sm font-medium ml-5 mr-10">
                {navItems.map((item) => {
                  const path =
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <NavLink
                      key={item}
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center justify-center px-2 py-1 text-[#000000] hover:bg-[#000000] hover:text-white rounded w-[5vw] ${isActive ? "bg-[#000000] text-white" : ""
                        }`
                      }
                    >
                      {item}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Icons */}
              <div className="flex items-end gap-3 lg:gap-4 ml-10">
                <Link to={"/wishlist"} className="relative p-2 rounded-full hover:bg-muted">
                  <Heart className="w-5 h-5" />
                </Link>

                {/* ✅ CART BUTTON */}
                <button
                  onClick={() => {
                    if (!Cookies.get("Jwt_token")) {
                      toast.warning("Please login to view your cart");
                      return;
                    }
                    if (!isCheckoutPage) {
                      setOpenCart(true);
                    }

                  }}
                  className="relative p-2 rounded-full hover:bg-muted cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </button>

                {login ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-full border hover:bg-muted text-sm"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border hover:bg-muted text-sm cursor-pointer hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-full border hover:bg-muted text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-16">
            <h1 className="text-lg font-bold">NextBuy</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCart(true)}
                className="relative p-2 rounded-full hover:bg-muted"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-muted"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ CART DRAWER */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
