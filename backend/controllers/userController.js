import User from '../models/userModel.js';
import Subscriber from '../models/subcriberModel.js'
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';



const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//routes for user login
const LoginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token, message: "Login Successfull" });
        }
        else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(err);
        res.json({ success: false, message: error.message })
    }

}

//routes for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //checking user already exists or not
        const exists = await User.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: "false", message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: "false", message: "Please enter a Strong Password" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id)

        res.json({ success: true, token, message: "User Registered" })

    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: error.message })
    }
}


//routes for Admin Login 
const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token, message: "Login Successfull" })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//subscribed user
const subscribedUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Check if the email already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: "This email is already subscribed!" }); // ⬅️ Use status(400)
        }

        // Save new subscriber
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.json({ success: true, message: "You are Subscribed." });
    } catch (error) {
        console.log(error);

        // Handle duplicate key error (MongoDB error code: 11000)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "This email is already subscribed!" }); // ⬅️ Use status(400)
        }

        res.status(500).json({ success: false, message: "Something went wrong!" }); // ⬅️ Use status(500) for unexpected errors
    }
};


//functions for list subscriber
const listSubscriber = async (req, res) => {
    try {

        const Subscribers = await Subscriber.find({});
        res.json({ success: true, Subscribers })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



//functions for list user
const listUser = async (req, res) => {
    try {

        const Users = await User.find({});
        res.json({ success: true, Users })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



export { LoginUser, registerUser, adminLogin, subscribedUser, listSubscriber, listUser }