import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [isHomePage, setIsHomePage] = useState(false);
  const [visible, setVisible] = useState(false);
  const { showSearch, setShowSearch, getCartCount, token, setToken, setCartItem, navigate } = useContext(ShopContext);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/collection')) {
      setIsHomePage(false);
    }
    else {
      setIsHomePage(true);
    }

  }, [location])

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login")
    setToken("");
    setCartItem({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to='/'>
        <img src={assets.bwlogo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700 hidden">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px]  bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <a href="https://e-commerce-mern-admin-qtw0.onrender.com/add"
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-gray-300 text-black font-semibold py-1 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300">
          Admin Panel
        </a>



      </ul>

      <div className="flex items-center gap-6">

        {
          isHomePage ? null : <img onClick={() => setShowSearch(!showSearch)} src={assets.search_icon} alt="" className="w-5 cursor-pointer" />
        }

        <div className="group relative">

          {token ? <img
            // onClick={() => token ? null : navigate('/login')}
            src={assets.profile_icon}
            alt=""
            className="w-5 cursor-pointer"
          /> :
            <p onClick={() => navigate('/login')} className=" cursor-pointer border-2 border-gray-300 text-black font-semibold py-1 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300">Login</p>}



          {/* -----------drop down------------ */}

          {token &&
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 ">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">Profile</p>
                <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black">Orders</p>
                <p onClick={() => logout()} className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          }
        </div>



        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"
          }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
          <a
            onClick={() => setVisible(false)}
            href="https://e-commerce-mern-admin-qtw0.onrender.com/add"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 pl-6 border">
            ADMIN LOGIN
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
