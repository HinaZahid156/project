import { Router } from "express";
import { Jwt } from "jsonwebtoken";
import { userModel } from "../models/user.js";
import { postModel } from "../models/post.js";
const adminRouter = Router();

const authMiddleware= async (req,res, next)=>{

    const token = req.headers.token;

    if(!token) {
        res.status(401).json({message: "Unauthorized"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById({_id:decoded.userId});

        if(!user) {
            res.status(401).json({message: "Unauthorized"});
            res.send();
        }

        next();
    }
    catch(err){
        res.ststus(401).json({message: err});
        res.send();
    }
};

adminRouter.use(authMiddleware);

adminRouter.post('/createpost', async (req,res)=>{
    try {
        console.log(req.body);
        const {title, body, userId} = req.body;

        const newPost = await postModel.create({
            title, 
            body,
            user: userId,
            cover: uploadurl
        });

        res.status(201).json({newPost});
    }
    catch(err) {
        console.log(err);
    }
});


export default adminRouter;