import orderModel from "../../../DB/model/order.model.js"

export const create =async(req,res)=>{
    const{productId} = req.params
    const{comment , rating} = req.body

    const order = await orderModel.findOne({
        userId : req.user._id , 
        status : 'Delivered',
        "products.productId" : productId
    })
    return res.status(200).json({ message: 'success',order})
}