const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    asset: {ref: "Asset", type: String, required: true},
    company_id: {type: String, ref: "Company"},
    invoice_no: String,
    invoice_url: String,
    warranty_start_date: Date,
    warranty_end_date: Date,
    remark: String,
}, {timestamps: true})


module.exports = mongoose.model('Invoice', invoiceSchema)


