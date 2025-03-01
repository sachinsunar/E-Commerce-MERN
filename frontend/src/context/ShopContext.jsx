import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const navigate = useNavigate();




    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItem);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { token } })

            } catch (error) {

                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                try {
                    if (cartItem[items][item] > 0) {
                        totalCount += cartItem[items][item];
                    }

                } catch (error) {
                    toast.error(error);
                }
            }
        }
        return totalCount;
    }


    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem)
        cartData[itemId][size] = quantity;
        setCartItem(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } })
            } catch (err) {
                toast.error(err.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItem) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItem[items]) {
                try {
                    if (cartItem[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItem[items][item];
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const res = await axios.post(backendUrl + "/api/product/list");
            if (res.data.success) {
                setProducts(res.data.products)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message)
        }
    };


    const getUserCart = async (token) => {
        try {
            const res = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } })
            if (res.data.success) {
                setCartItem(res.data.cartData)
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Trigger getUserCart when token is updated
    useEffect(() => {
        if (token) {  // Ensure token is set before making API request
            getUserCart(token);
        }
    }, [token]);



    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch, addToCart, cartItem, setCartItem, getCartCount, updateQuantity, getCartAmount
        , navigate, backendUrl, token, setToken,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;