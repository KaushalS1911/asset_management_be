const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
    asset_name: String,
    asset_type: String,
    asset_code: String,
    asset_image: String,
    company: String,
    seller_name: String,
    seller_company: String,
    seller_contact: String,
    purchase_date: Date,
    new_refurbish: String,
    in_warranty: Boolean,
    location: String,
    person_name: String,
    image_url: String,
    invoice_url: String,
    invoice_no: String,
    warranty_start_date: {type:Date, default: null},
    warranty_end_date: {type:Date, default: null},
    remark: String
}, {timestamps: true})


module.exports = mongoose.model('Asset', assetSchema)


