import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
    comment : {
        type:String,
        required: true,
    },
    productId :{
        type:Types.ObjectId ,
        ref : "Product",
        required: true,
    },
    rating:{
        type:Number,
        required: true,
        min:1,
        max:5
    },
    userId:{
        type:Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type:Object
    },

},
{
    timestamps:true,

});



const reviewModel = model('Review', reviewSchema);

export default reviewModel;