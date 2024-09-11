const ContractModel = require("../models/contract")

async function addContract(req, res) {
    try {
        const contractData = req.body;

        const nonDuplicateRecords = [];

        for (const record of contractData) {
            const {asset, start_date, end_date, company_name} = record;
            const formattedStartDate = new Date(start_date);
            const formattedEndDate = new Date(end_date);

            const existingRecord = await ContractModel.findOne({
                asset,
                start_date: {
                    $gte: new Date(formattedStartDate.setUTCHours(0, 0, 0, 0)),
                    $lte: new Date(formattedStartDate.setUTCHours(23, 59, 59, 999))
                }, end_date: {
                    $gte: new Date(formattedEndDate.setUTCHours(0, 0, 0, 0)),
                    $lte: new Date(formattedEndDate.setUTCHours(23, 59, 59, 999))
                },
                company_name
            });

            if (!existingRecord) {
                nonDuplicateRecords.push(record);
            }
        }

        if (nonDuplicateRecords.length > 0) {
            const data = await ContractModel.insertMany(nonDuplicateRecords);

            res.json({
                data: {
                    attendance: data,
                    message: "Contracts inserted successfully.",
                },
            });
        } else {
            return res.status(409).json({
                message: "Contract records already exist."
            });
        }
        const contracts = await ContractModel.insertMany(req.body);

        return res.status(201).json({data: contracts, message: "Contract details added successfully"});
    } catch (err) {
        console.error("Error creating service:", err.message);
        return res.status(500).json({error: "Failed to create service"});
    }
}

async function allContract(req, res) {
    try {
        const contracts = await ContractModel.find({}).populate('asset');
        return res.json(contracts);
    } catch (err) {
        console.error("Error fetching contracts:", err.message);
        return res.status(500).json({error: "Failed to fetch contracts"});
    }
}

async function singleContract(req, res) {
    try {
        const service = await ContractModel.findById(req.params.id);
        if (!service) {
            return res.status(404).json({error: 'Contract not found'});
        }
        return res.json(service);
    } catch (err) {
        console.error("Error fetching service:", err.message);
        return res.status(500).json({error: "Failed to fetch service"});
    }
}

async function updateContract(req, res) {
    try {
        const {id} = req.params;
        const updatedContract = await ContractModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedContract) {
            return res.status(404).json({error: "Contract not found"});
        }
        return res.status(200).json({data: updatedContract, message: "Contract updated successfully"});
    } catch (err) {
        console.error("Error updating service:", err.message);
        return res.status(500).json({error: "Failed to update service"});
    }
}

async function deleteContract(req, res) {
    try {
        const service = await ContractModel.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({error: "Contract not found"});
        }
        return res.json({message: "Contract deleted successfully"});
    } catch (err) {
        console.error("Error deleting service:", err.message);
        return res.status(500).json({error: "Failed to delete service"});
    }
}


module.exports = {addContract, allContract, singleContract, updateContract, deleteContract}