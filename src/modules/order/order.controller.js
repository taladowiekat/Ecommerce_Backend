import cartModel from "../../../DB/model/cart.model.js";
import cuoponModel from "../../../DB/model/cuopon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51Pd9R5I4kjIXsRpWdPEI5xNxpscIzboxqnptG3L5rompvktM209rfpw8JradZ2gEnXBk7f12ZyWCTgagMBD72MbI00oQj3rhP9');

export const create = async (req, res) => {
    const { couponName } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "cart is empty." });
    }

    if (couponName) {
        const coupon = await cuoponModel.findOne({ name: couponName });
        if (!coupon) {
            return res.status(400).json({ message: "coupon not found" });
        }

        if (coupon.expireDate < new Date()) {
            return res.status(400).json({ message: "coupon expired" });
        }

        if (coupon.usedBy.includes(req.user._id)) {
            return res.status(409).json({ message: "coupon already used" });
        }

        req.body.coupon = coupon;
    }

    let finalProductList = [];
    let subTotal = 0;
    for (let product of cart.products) {
        console.log('Checking product:', product);
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        });
        console.log('Product found:', checkProduct);

        if (!checkProduct) {
            return res.status(400).json({ message: `Product ${product.productId} not available in requested quantity` });
        }

        product = product.toObject();
        product.name = checkProduct.name;
        product.price = checkProduct.price;
        product.discount = checkProduct.discount;
        product.finalPrice = product.quantity * checkProduct.finalPrice;
        subTotal += product.finalPrice;
        finalProductList.push(product);
    }

    const user = await userModel.findById(req.user._id);
    if (!req.body.phone) {
        req.body.phone = user.phone;
    }
    if (!req.body.address) {
        req.body.address = user.address;
    }
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'USD',
                    unit_amount: subTotal - (subTotal * ((req.body.coupon?.amount || 0)) / 100),
                    product_data: {
                        name: req.userName
                    }
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `https://www.facebook.com`,
        cancel_url: `https://www.youtube.com`,
    });

    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount || 0)) / 100),
        address: req.body.address,
        phoneNumber: req.body.phone,
        updatedBy: req.user._id,
    });

    if (order) {
        for (const product of finalProductList) {
            await productModel.findOneAndUpdate({ _id: product.productId }, {
                $inc: {
                    stock: -product.quantity
                }
            });
        }

        if (req.body.coupon) {
            await couponModel.findOneAndUpdate({ _id: req.body.coupon._id }, {
                $addToSet: {
                    usedBy: req.user._id
                }
            });
        }

        await cartModel.updateOne({ userId: req.user._id }, {
            products: [],
        });
    }
    return res.status(200).json({ message: 'success', order, sessionId: session.id });
};



export const getOrders = async (req, res) => {
    const order = await orderModel.findOne({
        $or : [
            {
                status: 'pending'
            } ,
            {
                status: 'confirmed'
            }
        ]
    })
    return res.json({message : 'success' , order})
}


export const getUserOrders = async (req, res) => {
    const orders = await orderModel.find({userId:req.user._id})
    return res.json({message : 'success' , orders})
}


export const changeStatus = async (req, res) => {
    const {orderId} = req.params;
    const {status} = req.body;

    const order = await orderModel.findById(orderId);
    if(!order) {
        return res.json({message : 'order not found'});
    }
    order.status = status;
    await order.save();
    return res.json({message : 'success' , order})
}