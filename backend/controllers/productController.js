import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/productModel.js'

//function for add product
const addProduct = async (req, res) => {
    try {



        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imageURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageURL,
        }



        const product = new Product(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//functions for list products
const listProduct = async (req, res) => {
    try {

        const products = await Product.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//functions for remove products
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id)

        // Delete images from Cloudinary
        for (const imageUrl of product.image) {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public_id from URL
            await cloudinary.uploader.destroy(publicId);
        }


        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


//functions for single products info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await Product.findById(productId)
        res.json({ success: true, product })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct };