import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'


export const register = async (req , res ) =>{
    const {userName,email,password} = req.body ;

    const user = await userModel.findOne({email})

    if (user){
        return res.status(409).json({message:'User already registered'});
    }

    const hashedPassword = bcrypt.hashSync(password , parseInt(process.env.SALTROUND))

    const createUser = await userModel.create({userName,email,password:hashedPassword})

    return res.status(201).json({message:'sucess' , user:createUser})


}

export const login = async (req, res) => {
    const {password,email} = req.body ;

    const user = await userModel.findOne({email})

    if (!user){
        return res.status(409).json({message:'invalid data , email not found'});
    }

    if(user.status == "NotActive"){
        return res.status(403).json({message:'your account is bloked'});
    }

    const match = bcrypt.compareSync(password , user.password) ;

    if(!match){
        return res.status(400).json({message:'invalid data , password not match'});
    }
    const token = jwt.sign({id: user._id , status:user.status} , process.env.LOGINSIG)

    return res.status(200).json({message:"success", token})
}