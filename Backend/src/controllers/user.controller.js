import validator from "validator";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName, password, isSeller } = req.body
    console.log(fullName)

    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Email is invalid")
    }

    const existedUser = await User.findOne({email})
    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        fullName: fullName,
        email: email.toLowerCase(),
        password: password,
        isSeller: isSeller
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }
    
    return res
    .status(201)
    .json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    })
})

export { registerUser }