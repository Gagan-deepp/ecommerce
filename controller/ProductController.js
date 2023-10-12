const fs = require('fs')
const slugify = require('slugify')
const { productModel } = require('../models/ProductModel')
const braintree = require('braintree');
const { OrderModel } = require('../models/OrderModel');


//! Payment

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_KEY,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
});

const CreateProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        switch (true) {
            case !name:
                return res.status(500).send({ messgae: 'Name is required' })
            case !description:
                return res.status(500).send({ messgae: 'description is required' })
            case !price:
                return res.status(500).send({ messgae: 'price is required' })
            case !category:
                return res.status(500).send({ messgae: 'category is required' })
            case !quantity:
                return res.status(500).send({ messgae: 'quantity is required' })
            case photo && photo.size > 100000:
                return res.status(500).send({ messgae: 'Photo size is less than 1mb' })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        return res.status(201).send({
            success: true,
            message: "Product saved successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error
        })
    }
}
const UpdateProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        switch (true) {
            case !name:
                return res.status(500).send({ messgae: 'Name is required' })
            case !description:
                return res.status(500).send({ messgae: 'description is required' })
            case !price:
                return res.status(500).send({ messgae: 'price is required' })
            case !category:
                return res.status(500).send({ messgae: 'category is required' })
            case !quantity:
                return res.status(500).send({ messgae: 'quantity is required' })
            case photo && photo.size > 100000:
                return res.status(500).send({ messgae: 'Photo size is less than 1mb' })
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        return res.status(201).send({
            success: true,
            message: "Product Update successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Updating product",
            error
        })
    }
}

const getProductController = async (req, res) => {
    try {
        //! --> Fetching only products without image to reduce the load on api and limiting the output
        const product = await productModel.find({}).select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalProduct: product.length,
            message: 'Fetched All Products',
            product,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Fetching Products',
            error
        })
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Fetched data',
            product
        })
    } catch (error) {
        console.log(" Photo ------> ", error)
        res.status(500).send({
            success: false,
            message: "Unable to get product",
            error
        })
    }
}

const getPhotoController = async (req, res) => {
    try {
        const productPhoto = await productModel.findById(req.params.pid).select("photo")
        if (productPhoto.photo.data) {
            res.set("Content-Type", productPhoto.photo.contentType)
            return res.status(200).send(productPhoto.photo.data)
        }

    } catch (error) {
        console.log(" photo -------> ", error)
        res.status(500).send({
            success: false,
            message: "Unable to get photo",
            error
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid)
        return res.status(200).send({
            success: true,
            message: "item deleted"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Unable to Delete product",
            error
        })
    }

}

const filterProduct = async (req, res) => {
    try {

        const { checked, radio } = req.body
        let args = {}

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log("Filter---> ", error)
        res.status(500).send({
            success: false,
            message: "Error while doing filter",
            error
        })
    }
}

const productPagination = async (req, res) => {

    try {

        const pageLimit = 8;
        const pageNumber = req.params.pageNo || 1;
        const pageSkip = Number((pageNumber - 1) * pageLimit)

        const products = await productModel.find({}).limit(pageLimit).skip(pageSkip).select("-photo").sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            messgae: "error while pagination",
            error
        })
    }
}

const productByCategory = async (req, res) => {
    try {
        const products = await productModel.find({ category: req.params.catId }).select("-photo").limit(5)
        res.status(200).send({
            success: true,
            message: 'Product Category',
            products
        })
    } catch (error) {
        console.log("By Category---> ", error)
        res.status(500).send({
            success: false,
            message: "Error while doing filter",
            error
        })
    }
}

const searchProduct = async (req, res) => {
    try {
        const { keyword } = req.params
        const pageLimit = 8;
        const pageNumber = req.params.pageNo || 1;
        const pageSkip = Number((pageNumber - 1) * pageLimit)

        const searchResult = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).limit(pageLimit).skip(pageSkip).select("-photo").sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            searchResult
        })

    } catch (error) {
        console.log("By Searching---> ", error)
        res.status(500).send({
            success: false,
            message: "Error while doing filter",
            error
        })
    }
}

const braintreeToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
        });
    } catch (error) {
        console.log("Brain tree token -->", error)
    }
}

const braintreePayment = async (req, res) => {
    try {
        const { cartProduct, nonce } = req.body  //! nonce --> api self variable
        let total = 0;
        cartProduct.map((i) => total += i.price);
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                }
            },
            function (error, result) {
                if (result) {
                    const Order = new OrderModel({
                        products: cartProduct,
                        payment: result,
                        buyer: req.user._id
                    }).save();
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log("Brain tree payment -->", error)
    }
}
module.exports = {
    CreateProductController, getProductController, getSingleProductController, getPhotoController
    , deleteProduct, UpdateProductController, filterProduct, productPagination, productByCategory,
    searchProduct, braintreeToken, braintreePayment
}