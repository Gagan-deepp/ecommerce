const slugify = require("slugify")
const { CategoryModel } = require("../models/CategoryModel")
const e = require("express")

const createCatController = async (req, res) => {
    try {

        const { name } = req.body

        if (!name) {
            return res.status(401).send({ message: "Name Required" })
        }

        const ExistCat = await CategoryModel.findOne({ name })

        if (ExistCat) {
            return res.status(200).send({
                success: false,
                message: "Category already exist"
            })
        }

        const newCat = await new CategoryModel({ name, slug: slugify(name) }).save()

        return res.status(201).send({
            success: true,
            message: "Category Created ",
            newCat
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Category",
            error
        })
    }
}

const updateCatController = async (req, res) => {

    try {
        const { name } = req.body
        const { id } = req.params

        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            message: "Category Updated SuccessFuly",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(401).send({
            success : "false",
            message:"Error Occured !try again",
            error
        })
    }
}

const getAll = async (req, res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success : true,
            message: "All Category Fetched",
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message :"Error In Fetching",
            error
        })
    }
}

const deleteCategory = async (req,res) =>{
    try {
    
        const {id} = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message:"Category Deleted Success",
            
        })

    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message:"Error in deletion",
            error
        })
    }
}

module.exports = { createCatController, updateCatController,getAll , deleteCategory}