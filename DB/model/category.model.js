import  mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name : {
        type:String,
        unique : true,
        required: true,
        min:4,
        max:20
    },
    image:{
        type:Object,
        required: true,
    },
    slug:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        default:'Active',
        enum:["Active", "NotActive"],
    },
    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},
},
{
    timestamps:true,
});

const categoryModel = model('Category', categorySchema);

export default categoryModel