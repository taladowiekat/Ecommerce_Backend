import  mongoose, { Schema, Types, model } from "mongoose";

const cuoponSchema = new Schema({
    name : {
        type:String,
        unique : true,
        required: true,
    },
    amount : {
        type:Number,
        required:true,
    },
    usedBy:[
        {
            type:Types.ObjectId,ref : "User",required: true,
        }
    ],
    expireDate: {type:Date, required:true},
    // createdBy:{type:Types.ObjectId,ref:'User' , required:true},
},
{
    timestamps:true,
});

const cuoponModel = model('Cuopon', cuoponSchema);

export default cuoponModel