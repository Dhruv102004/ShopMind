import { Router } from "express"
import {
    getRecommendedProducts,
    getProduct,
    searchProducts,
    getProductsByCategories,
    getCategories,
    getComments,
    getRating,
    addRating,
    addComment
} from "../controllers/buyer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/get-recommended-products").get(verifyJWT, getRecommendedProducts)
router.route("/get-product/:productId").get(verifyJWT, getProduct)
router.route("/search-products").get(verifyJWT, searchProducts)
router.route("/get-product-by-categories").get(verifyJWT, getProductsByCategories)
router.route("/get-categories").get(verifyJWT, getCategories)
router.route("/get-comments/:productId").get(verifyJWT, getComments)
router.route("/get-rating/:productId").get(verifyJWT, getRating)
router.route("/add-rating/:productId").post(verifyJWT, addRating)
router.route("/add-comment/:productId").post(verifyJWT, addComment)

export default router