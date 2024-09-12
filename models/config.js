const mongoose = require('mongoose')


const configSchema = new mongoose.Schema({
    company_id: {type: String, ref: "Company"},
    asset_types: Array,
}, {timestamps: true})


module.exports = mongoose.model('Config', configSchema)


