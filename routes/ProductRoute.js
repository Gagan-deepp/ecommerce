const express = require('express')
const { requireSignin, adminAccess } = require('../middleware/middleware')
const { CreateProductController, getProductController, getSingleProductController, getPhotoController, deleteProduct, UpdateProductController, filterProduct, productPagination, productByCategory, searchProduct, braintreeToken, braintreePayment } = require('../controller/ProductController')
const formidable = require('express-formidable')

const ProductRouter = express.Router()

//! 1. Add item 
ProductRouter.post("/create-product" , requireSignin ,adminAccess , formidable() ,CreateProductController)

//! 1. Update item 
ProductRouter.put("/update-product/:pid" , requireSignin ,adminAccess , formidable() ,UpdateProductController)

//! 2. Get All Items
ProductRouter.get("/get-product" , getProductController)

//! 3. Single Product
ProductRouter.get("/get-product/:slug" , getSingleProductController)

//! 4. Get Photo of Product
ProductRouter.get("/get-photo/:pid" , getPhotoController )

//! 5. Delete a product
ProductRouter.delete("/delete-product/:pid" ,requireSignin , adminAccess , deleteProduct )

//! 6. Filter a product
ProductRouter.post("/product-filter" ,filterProduct )

//! 7. Pagination on Product
ProductRouter.post("/product-pagination/:pageNo" ,productPagination )

//! 8. Pagination on Product
ProductRouter.get("/productByCategory/:catId" ,productByCategory )

//! 9. Search for Product
ProductRouter.post("/search/:pageNo/:keyword" ,searchProduct )

//! 10. Payment
//#---> Get token
ProductRouter.get('/braintree/token',braintreeToken)
//# for payment
ProductRouter.post('/braintree/payment',requireSignin,braintreePayment)

module.exports = { ProductRouter }