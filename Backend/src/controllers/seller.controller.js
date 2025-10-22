import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const addProduct = asyncHandler(async(req, res) => {
    const { name, description, price, quantity } = req.body
    if (!name?.trim() || !description?.trim() || !price || !quantity) {
        throw new ApiError(400, "Please fill the required fields")
    }
    
    const imageLocalPath = req.files?.image[0]?.path
    if (!imageLocalPath) {
        throw new ApiError(400, "Image of product is required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)
    if (!image) {
        throw new ApiError(500, "Image upload failed")
    }
    console.log(image)

    const product = await Product.create({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        image: image.url,
        owner: req.user._id
    })

    return res
    .status(200)
    .json({
        success: true,
        message: "Product Added Successfully",
        product: product
    })
})

const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({owner: req.user._id})
    console.log(products)
    return res
    .status(200)
    .json({
        success: true,
        message: "List of all products listed by owner",
        products: products
    })
})

export {
    getProducts,
    addProduct
}