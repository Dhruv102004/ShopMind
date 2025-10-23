import { Router } from "express"
import {
    getRecommendedProducts,
    searchProducts,
    getProductsByCategories
} from "../controllers/buyer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/get-recommended-products").get(verifyJWT, getRecommendedProducts)
router.route("/search-products").get(verifyJWT, searchProducts)
router.route("/get-product-by-categories").get(verifyJWT, getProductsByCategories)

export default router