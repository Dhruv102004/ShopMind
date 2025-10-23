import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

const PAGE_SIZE = 10;

const addProduct = asyncHandler(async(req, res) => {
    const { name, description, price, quantity, category } = req.body
    if (!name?.trim() || !description?.trim() || !price || !quantity || !category) {
        throw new ApiError(400, "Please fill the required fields")
    }

    if(price<=0 || quantity<=0){
        throw new ApiError(400, "Price and Quantity has to be greater than 0")
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
        category: category,
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
    const page =  parseInt(req.query.page || "1", PAGE_SIZE)
    const skip = (page - 1)*PAGE_SIZE
    const totalProducts = await Product.countDocuments({owner: req.user._id})
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))
    const products = await Product.find({owner: req.user._id}).skip(skip).limit(PAGE_SIZE).lean();
    return res
    .status(200)
    .json({
        success: true,
        message: "List of all products listed by owner",
        products: products,
        totalPages: totalPages
    })
})

const updateProduct = asyncHandler(async(req, res) => {
    const {name , description, price , quantity} = req.body
    const {productId} = req.params
    if (!productId) {
        throw new ApiError(400, "Product ID is required")
    }
    if (!name?.trim() || !description?.trim() || price == null || quantity == null) {
        throw new ApiError(400, "Please fill the required fields")
    }

    if (price<=0) {
        throw new ApiError(400, "Price has to be greater than 0")
    }

    if (quantity<0) {
        throw new ApiError(400, "Quantity cannot be negative")
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name: name,
            description: description,
            price: price,
            quantity: quantity
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!updatedProduct) {
        throw new ApiError(404, "Product not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Product updated successfully",
        updatedProduct: updatedProduct
    })

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product is not present in database")
    }

    const deleteImage = await deleteFromCloudinary(product.image)
    if (!deleteImage) {
        throw new ApiError(500, "Unable to locate image in cloudinary")
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
        throw new ApiError(404, "Product not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Product deleted successfully",
        deletedProduct: deletedProduct,
    });
});

const searchProducts = asyncHandler(async (req, res) => {
    const productName = req.query.name?.trim();

    if (!productName) {
        return getProducts(req, res);
    }

    const page = parseInt(req.query.page || "1", PAGE_SIZE);
    const skip = (page - 1) * PAGE_SIZE;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp('^' + escapeRegex(productName), 'i');

    const filter = {
        owner: req.user._id, 
        name: nameRegex
    };

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const products = await Product.find(filter)
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean();

    return res.status(200).json({
        success: true,
        message: `Products starting with "${productName}" for owner`,
        products: products,
        totalPages: totalPages
    });
});

const getCategories = asyncHandler(async(_, res) => {
    const categories = Product.schema.path("category").enumValues;
    res.status(200).json({
        success: true,
        message: "List of all available categories",
        categories: categories
    });
})

export {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getCategories
}