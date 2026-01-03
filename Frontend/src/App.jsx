import React from 'react'
import "./App.css"
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx'
import Home from './components/Home.jsx';
import { Header } from './components/Navbar.jsx';
import AboutPage from './components/About.jsx';
import ProductDetail from './components/productDetail.jsx';
import ShopPage from './components/Shop.jsx';
import ContactPage from './components/Contact.jsx';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Wishlist from './components/Wishlist.jsx';
import Protected from './components/Protected.jsx';
import CartDrawer from "./components/Cart.jsx"; 
import Cookies from "js-cookie";
import CheckoutPage from './components/Checkout.jsx';
import Loader from './components/Loader.jsx';
import Profile from './components/Profile.jsx';
function App() {
  // ✅ CART STATE
  const API_URL = import.meta.env.VITE_API_URL;
  const [openCart, setOpenCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [login, setLogin] = useState(() => Cookies.get("Jwt_token") !== undefined);
  // ✅ FETCH CART COUNT
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!Cookies.get("Jwt_token")) return;

      try {
        const res = await fetch(`${API_URL}/cart/getCart`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("Jwt_token")}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          const items = data.cartProducts?.items || data.cart?.items || [];
          const totalQty = items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalQty);
        }
      } catch (err) {
        console.error("Error fetching cart count",err);
      }
    };

    fetchCartCount();
  }, [openCart, login]);
  return (
    <BrowserRouter>
      <Header  setOpenCart={setOpenCart} openCart={openCart}  cartCount={cartCount} setLogin={setLogin}/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/about-us' element={<AboutPage/>}/>
        
          <Route path='/wishlist' element={<Protected><Wishlist/></Protected>}/>
          <Route path='/product/:id' element={<Protected><ProductDetail/></Protected>}/>
          <Route path='/contact' element={<Protected><ContactPage/></Protected>}/>
          <Route path='/shop' element={<Protected><ShopPage/></Protected>}/>
          <Route path='/checkout' element={<Protected><CheckoutPage/></Protected>}/>
          <Route path='/profile' element={<Protected><Profile/></Protected>}/>
          
      </Routes>
    </BrowserRouter>
  )
}

export default App
