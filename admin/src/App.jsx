import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import List from './pages/List'
import Orders from './pages/Orders'
import Add from './pages/Add'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast';
import Subscriber from './pages/Subscriber'
import Users from './pages/Users'
import Loader from './components/Loader'
import axios from 'axios'


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs."

const App = () => {



  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const requestInterceptor = axios.interceptors.request.use(
      function (config) {
        setLoading(true);
        return config;
      },
      function (error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );


    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        setLoading(false);
        return response;
      },
      function (error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );


    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])



  return (
    <div className='bg-gray-50 min-h-screen'>
      <Toaster />
      {token === '' ? <Login setToken={setToken} /> : <>
        <Navbar setToken={setToken} />
        <Loader show={loading} />
        <hr className='border-1 border-gray-300' />
        <div className='flex w-full'>
          <Sidebar />

          <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
            <Routes>
              <Route path='/add' element={<Add token={token} />} />
              <Route path='/list' element={<List token={token} />} />
              <Route path='/orders' element={<Orders token={token} />} />
              <Route path='/subscriber' element={<Subscriber token={token} />} />
              <Route path='/users' element={<Users token={token} />} />
            </Routes>
          </div>
        </div>
      </>}

    </div>
  )
}

export default App