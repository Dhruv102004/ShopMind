import { Router } from "express"
import {
    getRecommendedProducts,
    getProduct,
    searchProducts,
    getProductsByCategories,
    getCategories
} from "../controllers/buyer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/get-recommended-products").get(verifyJWT, getRecommendedProducts)
router.route("/get-product/:productId").get(verifyJWT, getProduct)
router.route("/search-products").get(verifyJWT, searchProducts)
router.route("/get-product-by-categories").get(verifyJWT, getProductsByCategories)
router.route("/get-categories").get(verifyJWT, getCategories)

export default router