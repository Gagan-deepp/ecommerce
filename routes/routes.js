const express = require("express")
const { requireSignin, adminAccess, userAccess } = require("../middleware/middleware")
const { registerController, loginController, authCheck, orderController, allOrderController, orderStatusController } = require("../controller/controller")

// If you want to route in seprate file then U required route object
const router = express.Router()

//Routing 

//! 1. Route to Register || POST

router.post("/register" , registerController )

//! 2. Route to Login || POST

router.post("/login" , loginController)

//! 3. --> User Verify for user dashboard
router.get("/user-verify" , requireSignin, userAccess , (req , res) => {res.status(200).send({ok : true})})

//! 4. --> Verify Admin for Dashboard
router.get("/admin-verify" , requireSignin , adminAccess , (req , res) => {res.status(200).send({ok : true})})
// --->  Example of middleware :  router.post("/login" , middleware , loginController)

//! 5. ---> User Order
router.get("/get-order" , requireSignin , userAccess , orderController )

//! 6. ---> Admin Order
router.get("/get-all-order" , requireSignin , adminAccess , allOrderController )

//! 7. ---> Admin Order Status
router.put("/order-status/:itemId" , requireSignin , adminAccess , orderStatusController )
 

module.exports = { router }