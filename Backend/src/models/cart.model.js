import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js";

const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: {
      type: [cartProductSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// optional: ensure one cart per user
cartSchema.index({ owner: 1 }, { unique: true });

// add or increment product quantity
cartSchema.methods.addProduct = async function (productId, qty = 1) {
  const exists = this.products.some(p => p.product.equals(productId));
  if (exists) {
    throw new ApiError(400, "Product already exists in cart");
  }

  this.products.push({ product: productId, quantity: qty });
  return this.save();
};


// remove product
cartSchema.methods.removeProduct = async function (productId) {
  this.products = this.products.filter(p => !p.product.equals(productId));
  return this.save();
};

// set quantity of product
cartSchema.methods.setQuantity = async function (productId, qty) {
  if (qty <= 0) return this.removeProduct(productId);
  const p = this.products.find(p => p.product.equals(productId));

  if (p) p.quantity = qty;
  else this.products.push({ product: productId, quantity: qty });
  return this.save();
};


export const Cart = mongoose.model("Cart", cartSchema)