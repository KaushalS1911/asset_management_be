const mongoose = require('mongoose')


const contractSchema = new mongoose.Schema({
    asset: {type: String, ref: "Asset"},
    company_id: {type: String, ref: "Company"},
    start_date: Date,
    end_date: Date,
    company_name: String,
    company_contact: String,
    cost: Number,
    remark: String,
}, {timestamps: true})


module.exports = mongoose.model('Contract', contractSchema)


