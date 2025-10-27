import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js"

const PAGE_SIZE = 10;

const getRecommendedProducts = asyncHandler(async(req, res) => {
    const page =  parseInt(req.query.page || "1", 10)
    const skip = (page - 1)*PAGE_SIZE
    const totalProducts = await Product.countDocuments()
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))
    const products = await Product.find().skip(skip).limit(PAGE_SIZE).lean();
    return res
    .status(200)
    .json({
        success: true,
        message: "List of all products listed",
        products: products,
        totalPages: totalPages
    }) 
})

const getProduct = asyncHandler(async(req, res) => {
    const {productId} = req.params
    if (!productId) {
        throw new ApiError(400, "Product ID is not valid")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product not found")
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully retrieved product",
        product: product
    })
})

const searchProducts = asyncHandler(async (req, res) => {
    const productName = req.query.name?.trim();

    if (!productName) {
        return getRecommendedProducts(req, res);
    }

    const page = parseInt(req.query.page || "1", 10);
    const skip = (page - 1) * PAGE_SIZE;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp('^' + escapeRegex(productName), 'i');

    const filter = {
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
        message: `Products starting with "${productName}"`,
        products: products,
        totalPages: totalPages
    });
});

const getProductsByCategories = asyncHandler(async(req, res) => {
        const page =  parseInt(req.query.page || "1", 10)
        const category = req.query.category?.trim()
        if (!category) {
            return getRecommendedProducts(req, res)
        }
        const skip = (page - 1)*PAGE_SIZE
        const totalProducts = await Product.countDocuments({category: category})
        const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))
        const products = await Product.find({category: category}).skip(skip).limit(PAGE_SIZE).lean();
        return res
        .status(200)
        .json({
            success: true,
            message: "List of all products by category",
            products: products,
            totalPages: totalPages
        })    
})

const getCategories = asyncHandler(async(_, res) => {
    const categories = Product.schema.path("category").enumValues;
    res.status(200).json({
        success: true,
        message: "List of all available categories",
        categories: categories
    });
})

export {
    getRecommendedProducts,
    getProduct,
    searchProducts,
    getProductsByCategories,
    getCategories
}