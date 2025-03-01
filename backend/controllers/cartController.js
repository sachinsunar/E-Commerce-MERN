import User from "../models/userModel.js";


//add products to user cart
const addToCart = async (req, res) => {

    try {

        const { userId, itemId, size } = req.body;

        const userData = await User.findById(userId);
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await User.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added to Cart" })


    } catch (error) {

        console.log(error);
        res.json({ sucess: false, message: error.message })

    }

}


//update user cart
const updateCart = async (req, res) => {

    try {
        const { userId, itemId, size, quantity } = req.body

        const userData = await User.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await User.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {

        console.log(error);
        res.json({ sucess: false, message: error.message })

    }
}


//get user cart data
const getUserCart = async (req, res) => {

    try {

        const { userId } = req.body;

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });

    } catch (error) {

        console.log(error);
        res.json({ sucess: false, message: error.message })

    }

}


export { addToCart, updateCart, getUserCart }