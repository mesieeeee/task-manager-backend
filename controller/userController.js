import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"
import cloudinary from 'cloudinary';
import {User} from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";
export const register = catchAsyncErrors(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("User Avatar Required!", 400));
    }
    const {avatar} = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(
            new ErrorHandler(
                "please provide in png, jpg, webp or avif format!",400
            )
        );
    }
    const {name, email, phone, password} = req.body;
    if(!name || !email || !phone || !password){
        return next(new ErrorHandler("please fill full form!", 400));
    }
    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("User already exists!", 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    );
    if(!cloudinaryResponse || cloudinary.error){
        console.log(
            "Cloudinary Error",
            cloudinaryResponse.error || "Unkonown cloudinary error!"
        );
    }
    user = await User.create({
        name, email, phone, password, 
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    sendToken("User Registered!", user, res, 200);
});
export const login = catchAsyncErrors(async(req, res, next) => {
    const{email, password} = req.body;
    if(!email || !password){
        console.log(`email: ${email}, password:${password}`)
        return next(new ErrorHandler("please provide email and password!", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password!", 400));
    }
    sendToken("User Logged In", user, res, 200);
});
export const logout = catchAsyncErrors((req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "USER logger out!",
    });
});
export const myProfile = catchAsyncErrors(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});