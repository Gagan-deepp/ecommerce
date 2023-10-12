const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URL , {
            useUnifiedTopology:true,
            useNewUrlParser: true,
        })
        console.log(`DB connected to --> ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connectDB }