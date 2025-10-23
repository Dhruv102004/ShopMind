import { Router } from "express";
import { verifyJWT, verifySeller } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProducts,
    getCategories
} from "../controllers/seller.controller.js"

const router = Router();

router.route("/get-products").get(verifyJWT, verifySeller, getProducts)
router.route("/add-product").post(verifyJWT,
    upload.fields(
        [
            {
                name: "image",
                maxCount: 1
            }
        ]
    ),
    verifySeller, addProduct
)
router.route("/update-product/:productId").put(verifyJWT, verifySeller, updateProduct)
router.route("/delete-product/:productId").delete(verifyJWT, verifySeller, deleteProduct)
router.route("/search-products").get(verifyJWT, verifySeller, searchProducts)
router.route("/get-categories").get(verifyJWT, verifySeller, getCategories)

export default router