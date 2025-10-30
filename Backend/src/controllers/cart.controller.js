import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Stripe } from "stripe"

const calculateCartSummary = async (cart) => {
    try {
        if (!cart || !Array.isArray(cart.products)) {
            return { totalItems: 0, totalCost: 0 };
        }

        let totalItems = 0;
        let totalCost = 0;

        for (const item of cart.products) {
            const quantity = item.quantity || 0;
            const product = await Product.findById(item.product).select("price");
            if (product) {
                totalItems += quantity;
                totalCost += product.price * quantity;
            }
        }

        return { totalItems, totalCost };
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
};

const getItems = asyncHandler(async (req, res) => {
  const cartId = req.user?.cart;
  if (!cartId) {
    throw new ApiError(400, "No cart exists for this user");
  }

  const cart = await Cart.findById(cartId).populate({
    path: "products.product",
    model: "Product",
    select: "name price image",
  });

  if (!cart) {
    throw new ApiError(400, "No cart exists for this user");
  }

  const { totalItems, totalCost } = await calculateCartSummary(cart);

  const cartItems = cart.products.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.quantity * item.product.price,
  }));

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    totalItems,
    totalCost,
    cartItems,
  });
});


const addItem = asyncHandler(async(req, res) => {
    const cartId = req.user?.cart
    const { productId } = req.params
    const quantity = req.query.quantity
    if (!cartId) {
        throw new ApiError(400, "No cart exists for this user")
    }
    if (!productId || !quantity) {
        throw new ApiError(400, "Send Valid productId and quantity")
    }

    const cart = await Cart.findById(cartId)
    if (!cart) {
        throw new ApiError(400, "No cart exists for this user")
    }

    await cart.addProduct(productId, quantity)

    return getItems(req, res)

})

const removeItem = asyncHandler(async(req, res) => {
    const cartId = req.user?.cart
    const { productId } = req.params
    if (!cartId) {
        throw new ApiError(400, "No cart exists for this user")
    }
    if (!productId) {
        throw new ApiError(400, "Send Valid productId")
    }

    const cart = await Cart.findById(cartId)
    if (!cart) {
        throw new ApiError(400, "No cart exists for this user")
    }

    await cart.removeProduct(productId)

    return getItems(req, res)

})

const updateItem = asyncHandler(async(req, res) => {
    const cartId = req.user?.cart
    const { productId } = req.params
    const quantity = req.query.quantity
    if (!cartId) {
        throw new ApiError(400, "No cart exists for this user")
    }
    if (!productId || !quantity) {
        throw new ApiError(400, "Send Valid productId and quantity")
    }

    const cart = await Cart.findById(cartId)
    if (!cart) {
        throw new ApiError(400, "No cart exists for this user")
    }

    await cart.setQuantity(productId, quantity)

    return getItems(req, res)

})


const buyCart = asyncHandler(async(req, res) => {
    const {products} = req.body
    if (!products?.length) {
        throw new ApiError(400,"No products to purchase")
    }
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.name,
                images: [product.image]
            },
            unit_amount: Math.round(product.price*100)
        },
        quantity: product.quantity
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/buyer/success`,
        cancel_url: `${process.env.FRONTEND_URL}/buyer/failure`
    })

    return res
    .status(200)
    .json({
        success: true,
        id:session.id
    })

})


export {
    getItems,
    addItem,
    removeItem,
    updateItem,
    buyCart
}