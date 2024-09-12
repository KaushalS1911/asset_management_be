const ContractModel = require("../models/contract")

async function addContract(req, res) {
    try {
        const {companyId} = req.params

        const contractData = req.body;

        const nonDuplicateRecords = [];

        for (const record of contractData) {
            const {asset, start_date, end_date, company_name} = record;
            const formattedStartDate = new Date(start_date);
            const formattedEndDate = new Date(end_date);

            const existingRecord = await ContractModel.findOne({
                company_id: companyId,

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
                nonDuplicateRecords.push({...record, company_id: companyId});
            }
        }

        if (nonDuplicateRecords.length > 0) {
            const data = await ContractModel.insertMany(nonDuplicateRecords);

            res.json({
                status: 201,
                data,
                message: "Contracts inserted successfully.",
            });
        } else {
            return res.status(409).json({
                message: "Contract records already exist."
            });
        }
    } catch (err) {
        console.error("Error creating service:", err.message);
        return res.status(500).json({error: "Failed to create service"});
    }
}

async function allContract(req, res) {
    try {
        const {companyId} = req.params
        const contracts = await ContractModel.find({company_id: companyId}).populate("asset")
        return res.json(contracts);
    } catch (err) {
        console.error("Error fetching contracts:", err.message);
        return res.status(500).json({error: "Failed to fetch contracts"});
    }
}

async function singleContract(req, res) {
    try {
        const {id} = req.params
        const service = await ContractModel.findById(id).populate("asset");
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
        const {id, companyId} = req.params;

        const contract = await ContractModel.findById(id);
        if (!contract) {
            return res.status(404).json({error: "Contract not found"});
        }

        const isExist = await ContractModel.exists({company_id: companyId, asset: contract.asset, _id: { $ne: id }});
        if (isExist) {
            return res.status(400).json({error: "Contract for this asset already exists"});
        }

        const updatedContract = await ContractModel.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json({data: updatedContract, message: "Contract updated successfully"});

    } catch (err) {
        console.error("Error updating contract:", err.message);
        return res.status(500).json({error: "Failed to update contract"});
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