import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.route.js'
import sellerRouter from './routes/seller.route.js'
import buyerRouter from './routes/buyer.route.js'
import cartRouter from './routes/cart.routes.js'

app.use("/users", userRouter)
app.use("/seller", sellerRouter)
app.use("/buyer", buyerRouter)
app.use("/cart", cartRouter)

export { app };