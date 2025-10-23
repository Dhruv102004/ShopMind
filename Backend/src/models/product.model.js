import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        tags: {
            type: [String],
            default: []
        },

        price: {
            type: Number,
            required: true,
            min: 0.01
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true
        },

        viewedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        purchasedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        image: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)