const { hashPassword, comparePassword } = require("../helper/hash.")
const { userModel } = require("../models/model")
const { OrderModel } = require("../models/OrderModel")
const JWT = require("jsonwebtoken")
//# Controller Routes to Register
const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address } = req.body

        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!email) {
            return res.send({ message: "Email is required" })
        }
        if (!password) {
            return res.send({ message: "Password is required" })
        }
        if (!phone) {
            return res.send({ message: "Phone Number is required" })
        }
        if (!address) {
            return res.send({ message: "Address is required" })
        }

        const existUser = await userModel.findOne({ email })
        if (existUser) {
            return res.status(200).send({
                success: false,
                message: "User already registered !! Proceed to login"
            })
        }

        const hash = await hashPassword(password)

        await new userModel({ name, email, phone, address, password: hash }).save()

        const user = await userModel.findOne({ email })

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "7d" })

        res.status(201).send({
            success: true,
            message: "User Registered Successfully !!!",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Registration error",
            error
        })
    }
}

// # --> LogIn Controller

const loginController = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.send({ success: false, message: "Invalid Username or Password" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.send({
                success: false,
                message: "User isn't registered"
            })
        }

        const passComp = await comparePassword(password, user.password)
        if (!passComp) {
            return res.send({
                success: false,
                message: "Incorrect Password"
            })
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "7d" })

        res.status(200).send({
            success: true,
            message: "Login SuccessFully!!",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Login SuccessFull !!",
            error
        })
    }
}

const orderController = async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.user._id }).populate('products', '-photo')
        res.status(200).send({
            success: true,
            orders
        })

    } catch (error) {
        console.log(" Order error--->", error)
        res.status(500).send({
            success: false,
            message: "Unable to get order",
            error
        })
    }
}

const allOrderController = async (req, res) => {
    try {
        const orders = await OrderModel.find({}).populate('products', '-photo')
        res.status(200).send({
            success: true,
            orders
        })

    } catch (error) {
        console.log(" Order error Admin--->", error)
        res.status(500).send({
            success: false,
            message: "Unable to get order",
            error
        })
    }
}

const orderStatusController = async (req, res) => {
    try {

        const { itemId } = req.params
        const { status } = req.body
        const orders = await OrderModel.findByIdAndUpdate(itemId, { status }, { new: true })
        res.status(200).send({
            success: true,
            orders
        })

    } catch (error) {
        console.log(" Order Status error Admin--->", error)
        res.status(500).send({
            success: false,
            message: "Unable to set status",
            error
        })
    }
}


module.exports = { registerController, loginController, orderController, allOrderController, orderStatusController }