const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const res = require("express/lib/response");


//  Create New Order
exports.newOrder = catchAsyncErrors(async (req, res , next)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });


    res.status(200).json({
        success: true,
        order
    })
})


//  Get Single Order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found with this ID", 404))
    }

    res.status(200).json({
        success: true,
        order,
    })
})



//  Get logged in User Orders

exports.myOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    })
})


//  Get All Orders - Admin

exports.getAllOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({user: req.user._id});

    let totalAmount = 0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})



//  Update Order Status - Admin

exports.updateOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found with this ID", 404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this Order", 404));
    }

    order.orderItems.forEach(async o=>{
        await updateStocks(o.product, o.quantity)
    });

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});


    res.status(200).json({
        success: true,
    })
})

async function updateStocks (id, quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave: false});
}



//  Delete Orders - Admin

exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found with this ID", 404))
    }

    await order.remove();


    res.status(200).json({
        success: true,
    })
})