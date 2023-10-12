const JWT = require("jsonwebtoken");
const { userModel } = require("../models/model");

//*  Token based protected Routes 

const requireSignin = async (req , res ,next) =>{

    try {
        const decode = JWT.verify(req.headers.authorization , process.env.JWT_KEY)
        req.user = decode;
        next()
    } catch (error) {
        console.log(error)
    }
}

const adminAccess = async (req , res,next) =>{
    try {
        const user = await userModel.findById(req.user._id)

        if (user.role !== 1) {
            return res.status(401).send({
                success : false , 
                messgae : "UnAuthorized Admin"
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const userAccess = async (req , res,next) =>{
    try {
        const user = await userModel.findById(req.user._id)

        if (user.role !== 0) {
            return res.status(401).send({
                success : false , 
                messgae : "UnAuthorized User"
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { requireSignin ,adminAccess , userAccess}