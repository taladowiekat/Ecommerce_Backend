import slugify from "slugify";
import userModel from "../../../DB/model/user.model.js";
import cloudinary from "../../utls/cloudinary.js";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import reviewModel from "../../../DB/model/review.model.js";


export const getUsers = async(req,res) =>{
    const users = await userModel.find({});
    return res.status(200).json({ message: "success" , users });
}

export const getUserData = async(req,res)=>{
    const user= await userModel.findById(req.user.id);

    if(!order){
        return res.status(400).json({ message: "can't review this order" });
    }

    const checkReview = await reviewModel.findOne({
        userId: req.user._id,
        productId: productId
    })
    if(checkReview){
        return res.status(409).json({ message:"already reviewed"});
    }

    if(req.file){
        const {secure_url , public_id} =await cloudinary.uploader.upload(req.file.path,{
            folder : `talaShop/${productId}/reviews`
        })
        req.body.image = {secure_url , public_id}
    }

    const review = await reviewModel.create({
        comment,rating,productId,userId:req.user._id,image:req.body.image
    })

    return res.status(201).json({message:"success", review})
}

