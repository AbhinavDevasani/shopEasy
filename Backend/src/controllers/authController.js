import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { CartModel } from "../models/cartModel.js";
import { WishlistModel } from "../models/wishlistModel.js";
import { UserModel } from "../models/userModel.js";

export const register = async (req,res)=>{
    const {username, email, password} = req.body;
    try {
        if(!username.trim()||!email.trim() || !password.trim()){
            res.status(400).json({error:"Required fields"})
        }
        const existingUser = await UserModel.findOne({email})
        if (existingUser){
           return res.status(400).json({error:"User Already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword
        })

        if(!newUser){
            return res.status(400).json({error:"Error in creating a new user"})
        }
        else{
            await CartModel.create({user: newUser._id, items:[]} )
            await WishlistModel.create({user: newUser._id, items:[]})

            return res.status(201).json({
                message:"Registration Successful",
                user: newUser,
                error:false
            })
        }

    } catch (err) {
        console.log("Error in registering",err)
        return res.status(500).json({error:"Something went wrong while registering",err})
    }
}

export const login = async (req, res)=>{
    const {email, password} = req.body;
    try {
        if(!email.trim() || !password.trim()){
            res.status(400).json({error:"Required fields"})
        }
        const existingUser = await UserModel.findOne({email});
        if(!existingUser){
            return res.status(404).json({error:"User not found!"})
        }else{
            const validPassword = await bcrypt.compare(password, existingUser.password);
            if(!validPassword){
                return res.status(401).json({error:"Invalid Credentials. Please enter valid credentials"})
            }
            else{
                const secret_code = process.env.secret_key

                const payLoad = {
                    id:existingUser._id,
                    username:existingUser.username,
                    email:existingUser.email
                }
                const jwtToken = jwt.sign(payLoad, secret_code, {expiresIn: "7d"})

                return res.status(200).json({
                    message:"Login Successful",
                    user:payLoad,
                    token:jwtToken
                })

            }
        }
    } catch (err) {
        console.log("Error in login",err)
        res.status(500).json({error:"Something went wrong while Authenticating"})
    }
}