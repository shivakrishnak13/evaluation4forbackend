const {Router} = require("express");
const { PostModel } = require("../model/post.model");

const postRouter = Router();

postRouter.get("/", async (req,res)=>{
    const pageno= req.query.pageno;
    const limit = req.query.limit;
    const skip = (pageno-1)*limit;
    const userID = req.payload;
    console.log(userID)
    try {
        const posts = await PostModel.find({}).sort({no_of_comments:1}).skip(skip).limit(limit)
        res.status(200).json({msg:"User Posts",posts});
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});

postRouter.get("/top", async (req,res)=>{
    const pageno= req.query.pageno;
    const limit = 3;
    const skip = (pageno-1)*limit;
    try {
        const topposts = await PostModel.find({}).sort({no_of_comments:-1}).skip(skip).limit(limit)
        res.status(200).json({msg:"User Posts",topposts});
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});

postRouter.post("/add", async (req,res)=>{
    const {no_of_comments,title,body,device} = req.body;
    const userID = req.payload;
    try {
        const post = new PostModel({title,body,device,no_of_comments,userID});
        await post.save();
        res.status(200).json({msg:"Post was added"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});

postRouter.patch("/update/:postID ", async (req,res)=>{
    const {postID} = req.params;
    const userID = req.payload;
    try {
        const post = await PostModel.findByIdAndUpdate({userID,_id:postID},req.body);
        if(!post){
            res.status(400).json({msg:"Post not found"});
        }else{
            res.status(200).json({msg:"Post was updated",post})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});




postRouter.delete("/delete/:postID", async (req,res)=>{
    const {postID} = req.params;
    const userID = req.payload;
    console.log(postID)
    try {
        const post = await PostModel.findByIdAndDelete({userID,_id:postID});
        if(!post){
            res.status(400).json({msg:"Post not found"});
        }else{
            res.status(200).json({msg:"Post was deleted",post})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});


module.exports = {postRouter};