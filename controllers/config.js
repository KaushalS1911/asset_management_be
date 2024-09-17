const ConfigModel = require("../models/config")

async function getConfigs(req, res) {
    try {
        const {companyId} = req.params

        const data = await ConfigModel.findOne({company_id: companyId})

        return res.json({data, status: 200})
    } catch (err) {
        return res.status(500).json({status: 500, message: "Internal server error"})
    }
}

async function updateConfigs(req, res) {
    try {
        const {id} = req.params

        const config = await ConfigModel.findById(id)

        if(!config) res.json({message: "Configs not found.", status: 404})

        const data = await ConfigModel.findByIdAndUpdate(id, req.body, {new: true})

        return res.json({data, status: 200})
    } catch (err) {
       return  res.status(500).json({status: 500, message: "Internal server error"})
    }
}

module.exports = {getConfigs,updateConfigs}