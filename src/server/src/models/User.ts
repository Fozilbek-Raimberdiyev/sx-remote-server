import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    otp : {
        code : String,
        expiry : Date,
    },
},{
    timestamps : true,
})

export default mongoose.model("User", userSchema);