const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    password: String,
}, {timestamps: true})


module.exports = mongoose.model('Company', companySchema)


