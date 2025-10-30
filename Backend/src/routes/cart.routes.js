import { Router } from "express"
import {
    getItems,
    addItem,
    removeItem,
    updateItem,
    buyCart
} from '../controllers/cart.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-items").get(verifyJWT, getItems)
router.route("/add-item/:productId").post(verifyJWT, addItem)
router.route("/remove-item/:productId").post(verifyJWT, removeItem)
router.route("/update-item/:productId").post(verifyJWT, updateItem)
router.route("/buy-cart").post(verifyJWT, buyCart)

export default router