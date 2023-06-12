const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BlacklistModel } = require("../model/blacklist.model");


const auth = async (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];
    try {
        const btken = await BlacklistModel.findOne({btoken: token});
        if(btken){
            res.status(200).json("User has been logged out. please login!!!")
        }else{
            const decoded = jwt.verify(token,process.env.SECRET);
            req.payload = decoded.userID;
            
            next()
        } 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

module.exports = {auth};