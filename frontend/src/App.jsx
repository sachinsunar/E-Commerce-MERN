import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBox from "./components/SearchBox";
import { Toaster } from 'react-hot-toast';
import Loader from "./components/Loader";
import axios from "axios";


const App = () => {


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      function (config) {
        setLoading(true); // Start loading before request
        return config;
      },
      function (error) {
        setLoading(false); // Stop loading on request error
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        setLoading(false); // Stop loading after response
        return response;
      },
      function (error) {
        setLoading(false); // Stop loading even on error
        return Promise.reject(error);
      }
    );

    // Cleanup: Remove interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <div className="px-4 sm:px-[5vw] md:px[7vw] lg:px-[9vw]">
      <Toaster />
      <Navbar />
      <Loader show={loading} />
      <SearchBox />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
