import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        required: true
    },
    coverImage: {
        type: String //cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

//Arrow function not used due to context issues as will use this keyword
//Using mongoose pre hook
userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next() 

    /*The 10 in bcrypt.hash(this.password, 10) refers to the salt rounds used when hashing the password.
    Explanation:
    Salt: A random value added to the password before hashing to make the hash output unique, even for identical passwords.
    Salt rounds: The number of times the hashing process is applied (or the computational complexity). The higher the  number, the more secure but slower the hashing process.
    In this case, 10 means the password will go through 10 rounds of hashing, which provides a good balance between    security and performance.*/
})

//Mongoose method
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

//Mongoose method
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Mongoose method
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)