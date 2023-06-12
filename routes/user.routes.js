const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { BlacklistModel } = require("../model/blacklist.model");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
    const { password,name,email,gender,is_married,age,city } = req.body;
    
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(200).json({ msg: "User Already Registered" })
        } else {

            bcrypt.hash(password, 3, async (error, hash) => {
                if (hash) {
                    const newUser = new UserModel({name,email,is_married,gender,age,city,password:hash});
                    await newUser.save();
                    res.status(200).json({ msg: "User Registration Sucessfull" })
                }
            })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

userRouter.post("/login", async (req, res) => {
    const {email,password} = req.body
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){
                    var token = jwt.sign({userID: user._id},process.env.SECRET)
                    res.status(200).json({msg:"User Logged in Sucessfull",token})
                }else{
                    res.status(200).json({msg:"Incorrect Password"})
                }
            })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});


userRouter.post("/logout", async (req, res) => {
    const btoken = req.headers.authorization.split(" ")[1];
    try {
        const token = new BlacklistModel({btoken});
        token.save();
        res.status(200).json({msg:"User Logged Out Sucessfull"})      
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});



module.exports = { userRouter };