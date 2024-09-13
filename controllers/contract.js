const ContractModel = require("../models/contract")

async function addContract(req, res) {
    try {
        const { companyId } = req.params;
        const { assets, start_date, end_date, remark, cost, company_contact, company_name } = req.body;

        const conflictingContracts = await ContractModel.find({
            company_id: companyId,
            assets: { $in: assets }
        });

        const assignedAssets = conflictingContracts.flatMap(c => c.assets);

        const newAssets = assets.filter(asset => !assignedAssets.includes(asset));

        if (newAssets.length === 0) {
            return res.status(400).json({ error: "All the assets are already assigned to other contracts" });
        }

        const contract = {
            assets: newAssets,
            start_date,
            end_date,
            remark,
            cost,
            company_contact,
            company_name,
            company_id: companyId
        };

        const data = await ContractModel.create(contract);

        return res.status(201).json({ message: "Contract added successfully", data });

    } catch (err) {
        console.error("Error creating contract:", err.message);
        return res.status(500).json({ error: "Failed to create contract" });
    }
}


async function allContract(req, res) {
    try {
        const {companyId} = req.params
        const contracts = await ContractModel.find({company_id: companyId})
        return res.json(contracts);
    } catch (err) {
        console.error("Error fetching contracts:", err.message);
        return res.status(500).json({error: "Failed to fetch contracts"});
    }
}

async function singleContract(req, res) {
    try {
        const {id} = req.params
        const service = await ContractModel.findById(id)
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
        const { id, companyId } = req.params;
        const { assets } = req.body;

        const contract = await ContractModel.findById(id);
        if (!contract) {
            return res.status(404).json({ error: "Contract not found" });
        }

        const conflictingContracts = await ContractModel.find({
            company_id: companyId,
            assets: { $in: assets },
            _id: { $ne: id }
        });

        const assignedAssets = conflictingContracts.flatMap(c => c.assets);

        const newAssets = assets.filter(asset => !assignedAssets.includes(asset));

        if (newAssets.length === 0) {
            return res.status(400).json({ error: "All the assets are already assigned to other contracts" });
        }

        contract.assets = [...new Set([...contract.assets, ...newAssets])]; // Prevent duplicates


        const updatedContract = await contract.save();

        return res.status(200).json({ data: updatedContract, message: "Contract updated successfully with new assets" });

    } catch (err) {
        console.error("Error updating contract:", err.message);
        return res.status(500).json({ error: "Failed to update contract" });
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