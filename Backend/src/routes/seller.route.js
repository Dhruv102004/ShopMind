import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/seller.controller.js"

const router = Router();

router.route("/get-products").get(verifyJWT, getProducts)
router.route("/add-product").post(verifyJWT,
    upload.fields(
        [
            {
                name: "image",
                maxCount: 1
            }
        ]
    ),
    addProduct
)
router.route("/update-product/:productId").post(verifyJWT, updateProduct)
router.route("/delete-product/:id").post(verifyJWT, deleteProduct)

export default router