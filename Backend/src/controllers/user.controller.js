import validator from "validator";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async function(user){
    try{
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken(); 

        user.refreshToken = refreshToken
        // while saving there should be password also(check the user model), all those check properties also kick in
        await user.save({ validateBeforeSave: false} )
        return {accessToken, refreshToken}
    } catch {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

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

const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body
    if(!password || !email) {
        throw new ApiError(400, "email and password are required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        success: true,
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
    })

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success: true,
        message: "User logged out successfully"
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorised request")
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

export { 
    registerUser,
    loginUser,
    logoutUser ,
    refreshAccessToken
}