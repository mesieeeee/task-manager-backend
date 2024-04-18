import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide your name"],
        minLength: [3, "Name must contain at least 3 charachters"],
        maxLength: [30, "name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "please provide your email"],
        unique: [true, "user already registered"],
        validate: [validator.isEmail, "please provide valid email"],
    },
    phone: {
        type: Number,
        required: [true, "please provide your phone number"],
    },
    password: {
        type: String,
        required: [true, "please provide your password"],
        minLength: [8, "password must contain at least 8 charachters"],
        maxLength: [32, "password cannot exceed 32 characters"],
        select: false,
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);