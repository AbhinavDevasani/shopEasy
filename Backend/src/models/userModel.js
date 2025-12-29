import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        phone: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        }
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const UserModel = mongoose.model("User", userSchema);