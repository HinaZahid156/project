import { Router } from "express";
import { postModel } from "../config/models/post.js";
import { hash, compare } from 'bcrypt';
import { userModel } from "../models/user.js";
import { Jwt } from 'jsonwebtoken';
const mainRouter = Router();


mainRouter.get('/posts', async(req,res)=>{

    try{
        const data = await postModel.find();
        const count = await postModel.count();

        if(count > 0){
            res.json(data);
        }
        else {
            res.json({message: "No posts found"});
        }
        res.end();
    }
    catch(err) {
        console.log(err);
    }
});


mainRouter.get('/posts/:id', async(req,res)=>{

    try{

        let postId= req.params.id;
        const data = await postModel.findById({ _id: parseInt(postId) });
        const count = await postModel.count();

        if(data){
            res.json(data);
        }
        else {
            res.json({message: "No posts with specified id was found"});
        }
        res.end();
    }
    catch(err) {
        console.log(err);
    }
});

mainRouter.post('/register', async(req,res)=>{
    const {username, email, password} = req.body;
    const encryptedPassword = await hash(password, 10);

    try{
        const user = await userModel.creat({
            username,
            email,
            password:encryptedPassword
        });
        res.status(201).json({message: "User registerd successfully", user});
        res.end();
    }
    catch(err){
        console.log(err);
        res.json({message:err});
        res.end();
    }
});

mainRouter.post('/login', async(req,res)=>{
    const {username, password} = req.body;

    try{
       const user = await userModel.findOne({username});

       if(!user) {
        res.status(401).json({message: "User not found"});
        res.end();
       }

       const isPasswordValid = await compare(password, user.password);

       if(!isPasswordValid){
        res.status(401).json({message:"Unauthorized, invalid credentials"});
        res.end();
       }

       const token = Jwt.sign({userId: user._id}, process.env.JWT_SECRET);
       res.status(200).json({token: token });
       res.end();
    }
    catch(err) {
        console.log(err);
    }
});

export default mainRouter;