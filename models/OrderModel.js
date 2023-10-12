const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    products : [{
        type: mongoose.ObjectId,
        ref: "Product",
    }],
    payment : {},
    buyer : {
        type: mongoose.ObjectId,
        ref: "users",
    },
    status:{
        type: String,
        default : "Not Processed",
        enum : ["Not Processed" , "Processing" ,"Shipped" , "Delivered" , "Exchanged" , "Returned" ,"Cancel"]
    }
} , {timestamps: true})

const OrderModel = mongoose.model('Order' , OrderSchema);

module.exports = {OrderModel}