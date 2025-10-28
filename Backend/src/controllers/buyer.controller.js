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

const getComments = asyncHandler(async(req, res) => {
    const { productId } = req.params
    if (!productId) {
        throw new ApiError(400, "Send valid product ID")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product not present")
    }

    const comments = product.review
    .filter( productReview => productReview.comment !== "" )
    .map( productReview => productReview.comment )

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully retrieved comments",
        comments: comments,
        totalComments: comments.length
    })

})

const getRating = asyncHandler(async(req, res) => {
    const { productId } = req.params
    if (!productId) {
        throw new ApiError(400, "Send valid product ID")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product not present")
    }

    if (!product.review?.length) {
        return res
        .status(200)
        .json({
            success: true,
            message: "No reviews present for the product",
            averageRating: 0,
            totalReviews: 0
        })
    }

    const rating = product.review
    .map( productReview => productReview.rating )

    const averageRating = rating.reduce((sum, rating) => sum + rating, 0)/(rating.length)

    return res
    .status(200)
    .json({
        success: true,
        message: "Average rating of the product",
        averageRating: averageRating,
        totalReviews: rating.length
    })

})

const addRating = asyncHandler(async(req, res) => {
    const { productId } = req.params
    const { rating } = req.body
    if (!productId) {
        throw new ApiError(400, "Send valid product ID")
    }
    if (!rating || rating > 5) {
        throw new ApiError(400, "Rating should be between 1 and 5")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product not present")
    }

    if (product.review?.some(r => r.reviewer.equals(req.user._id))) {
        throw new ApiError(400, "Rating already exists for this user");
    }
    
    product.review.push({
        reviewer: req.user._id,
        rating: rating
    })

    await product.save()

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully added rating",
    })
    
})

const addComment = asyncHandler(async(req, res) => {
    const { productId } = req.params
    const { comment } = req.body
    if (!productId) {
        throw new ApiError(400, "Send valid product ID")
    }
    if (!comment?.trim()) {
        throw new ApiError(400, "Comment should be present")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "Product not present")
    }

    const review = product.review?.find(r => r.reviewer && r.reviewer.equals(req.user._id))
    if (!review) {
        throw new ApiError(400, "Enter the rating first");
    }

    if(review.comment !== ""){
        throw new ApiError(400, "Comment already exists for this user")
    }
    review.comment = comment
    await product.save()

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully added comment",
    })
    
})

export {
    getRecommendedProducts,
    getProduct,
    searchProducts,
    getProductsByCategories,
    getCategories,
    getComments,
    getRating,
    addRating,
    addComment
}