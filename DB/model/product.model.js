import  mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name : {
        type:String,
        unique : true,
        required: true,
        min:4,
        max:20,
        trim:true,
    },
    slug:{
        type:String,
        required: true,
    },
    dicription:{
        type:String,
        required: true,
    },
    stock:{
        type:Number,
        default:1
        },
    price:{
        type:Number,
        required: true,
    },
    discount:{
        type:Number,
        deafult:0
    },
    finalPrice:{
        type:Number,
    },
    mainImage:{
        type:Object,
        required: true,
    },
    subImages:[{
        type:Object,
        required: true,
    }],
    sizes:[{
        type:String,
        enum:['s', 'm', 'lg', 'xl']
    }],
    colors:[String],
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required: true
    },
    subcategoryId:{
        type:Types.ObjectId,
        ref:'SubCategory',
        required: true
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
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

productSchema.virtual('reviews', {
    ref:'Review',
    localField:'_id',
    foreignField:'productId'
})


const productModel = model('Product', productSchema);

export default productModel