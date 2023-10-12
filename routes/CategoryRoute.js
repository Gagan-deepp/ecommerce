const express =  require('express')
const { requireSignin, adminAccess } = require('../middleware/middleware')
const { createCatController, updateCatController, getAll, deleteCategory } = require('../controller/CategoryController')

const Catrouter = express.Router()

//! --> Create Category

Catrouter.post('/create-category' , requireSignin , adminAccess , createCatController)

//! 2--> Update Category

Catrouter.put("/update-category/:id" ,requireSignin , adminAccess , updateCatController )

//! 3--> Get All Category

Catrouter.get('/getcategory', getAll)

//! 4.--> Delete Category

Catrouter.delete("/delete-category/:id" , requireSignin ,adminAccess ,deleteCategory )
module.exports = { Catrouter }