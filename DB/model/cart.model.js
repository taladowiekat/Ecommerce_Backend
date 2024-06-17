import  mongoose, { Schema, Types, model } from "mongoose";

const cart = new Schema({
    userId : {
        type:Types.ObjectId,
        ref : "User",
        required: true,
        unique: true
    },
    products:[
        {
            productId : {type:Types.ObjectId,ref : "Product",required: true,},
            quantity: {type:Number , default:1}
        }
    ],

},
{
    timestamps:true,

});



const cartModel = model('Cart', cart);

export default cartModel