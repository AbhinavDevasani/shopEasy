import React from 'react'
import { User, Lock, Mail, Eye, EyeOff, GraduationCap, Phone, List, Cookie } from 'lucide-react';
import { useState} from 'react'
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
function Login() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const  [message, setMessage] = useState("")
    const [Loginloading, setLoginLoading] = useState(false)
    const [Registerloading, setRegisterLoading] = useState(false)
    const location = useLocation();
    const navigate = useNavigate()
    const from = location.state?.from || "/";

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!loginData.email.endsWith("@gmail.com")) {
    setError("Please enter valid email");
    return;
  }

  setLoginLoading(true);

  try {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login Failed");
      return;
    }

    Cookies.set("Jwt_token", data.token, { expires: 30 });

    toast.success("Login successful");

    // ✅ Redirect to intended page
    navigate(from, { replace: true });

  } catch (err) {
    setError("Something went wrong. Please try again.",err);
  } finally {
    setLoginLoading(false);
  }
};


const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setMessage("");

  
  if (registerData.username.length < 3) {
    setError("Username must be at least 3 characters");
    return;
  } else if (!registerData.email.endsWith("@gmail.com")) {
    setError("Please enter valid email");
    return;
  } else if (
    registerData.password &&
    registerData.confirmPassword &&
    registerData.password !== registerData.confirmPassword
  ) {
    setError("Password does not match. Please try again");
    return;
  }

  setRegisterLoading(true);

  try {
    const options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      })
    };

    const response = await fetch(`${API_URL}/auth/register/`, options);
    const data = await response.json();
    

    if (!response.ok) {
      setError(data.error || "Registering Failed");
      return;
    }

    setError(null);
    setMessage(data.message);
    setActiveTab("login")
  } catch (error) {
    console.error(error);
    setError("Something went wrong. Please try again.");
  } finally {
    setRegisterLoading(false);
  }
};

  return (
    <div className="min-h-screen  bg-linear-to-br from-slate-50 to-slate-100 md:flex items-center justify-evenly p-4">
        <div className='flex justify-center items-center gap-2 mt-16 md:hidden'>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-lg">
                <span className="text-2xl font-bold text-white">S</span>
            </div>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">ShopEasy</h1>
            </div>
        </div>
        <div className="text-center mb-8 mr-6 max-w-150 hidden md:block">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-lg">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">ShopEasy</h1>
          <p className="text-lg text-slate-600 mb-8 ">
            Your one-stop destination for everything you need. Shop with confidence, delivered fast.
          </p>
        </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Tab Headers */}
          <div className="flex bg-slate-200 rounded-lg p-1 mb-2">
            <button onClick={() => setActiveTab('login')} className={`flex-1 py-2 px-4 rounded font-medium transition-all ${activeTab === "login" ? "bg-white text-slate-900 shadow-sm" : " bg-slate-200 text-slate-500 hover:text-slate-700"}`}>Login</button>
            <button onClick={() => setActiveTab('register')} className={`flex-1 py-2 px-4 rounded font-medium transition-all ${activeTab === "register" ? "bg-white text-slate-900 shadow-sm" : " bg-slate-200 text-slate-500 hover:text-slate-700"}`}>Register</button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' && (
              <form className="space-y-6 animate-fadeIn" onSubmit={handleLoginSubmit}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2   transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required name='email' type="email" placeholder="Email Address" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full pl-12 pr-12 py-3 bg-white/10 border border-slate  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2  transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full pl-12 pr-12 py-3 bg-white/10 border border-slate  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2  transform -translate-y-1/2 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="text-left">
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button type='submit' className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    {Loginloading ?
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⏳</span>
                            <span>Logining...</span>
                        </span> : 'Login'
                    }
                </button>
                
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form className="space-y-6 animate-fadeIn" onSubmit={handleRegisterSubmit}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 mt-3  transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Username</label>
                  <input required name='username' type="text" placeholder="Full Name" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} className="w-full pl-12 pr-12 py-3 bg-white/10 border border-slate  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                  <Mail className="absolute left-3 top-1/2 mt-3 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required name='email' type="email" placeholder="Email Address" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full pl-12 pr-12 py-3 bg-white/10 border border-slate  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label> 
                  <Lock className="absolute left-3 mt-6 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full pl-12 pr-12 py-3 bg-white/10 border  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 mt-3 transform -translate-y-1/2 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-500" /> : <Eye className="w-5 h-5 text-slate-500" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
                  <Lock className="absolute left-3 mt-6 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} className={`w-full pl-12 pr-12 py-3 bg-white/10 border  rounded-xl text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 `}/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 mt-3 transform -translate-y-1/2 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-slate-500" /> : <Eye className="w-5 h-5 text-slate-500" />}
                  </button>
                </div>
                
                <div className="flex items-center">{error ? <p className="text-red-500 text-sm ml-2">{error}</p>: <p className="text-success-500 text-sm ml-2">{message}</p>}</div>
                <button type='submit' className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    {Registerloading?
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⏳</span>
                            <span>Create Account</span>
                        </span> : 'Create Account'
                    }
                </button>
                
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
