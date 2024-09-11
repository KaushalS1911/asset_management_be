const AssetModel = require("../models/assets")
const {uploadFile, uploadInvoiceFile} = require('../helpers/images');


async function handleFileUploads(files) {
    const assetImage = files['asset-image'] ? files['asset-image'][0] : null;
    const invoiceImage = files['invoice-image'] ? files['invoice-image'][0] : null;

    const assetImageUrl = assetImage ? await uploadFile(assetImage.buffer) : null;
    const invoiceImageUrl = invoiceImage ? await uploadInvoiceFile(invoiceImage.buffer) : null;

    return {assetImageUrl, invoiceImageUrl};
}


async function addAsset(req, res) {
    try {
        const isExist = await AssetModel.exists({
            asset_name: req.body.asset_name,
            asset_type: req.body.asset_type,
            asset_code: req.body.asset_code
        });
        if (isExist) {
            return res.status(400).json({error: 'Asset with entered details already exists.'});
        }

        const {assetImageUrl, invoiceImageUrl} = await handleFileUploads(req.files);

        const asset = await AssetModel.create({...req.body, image_url: assetImageUrl, invoice_url: invoiceImageUrl});

        return res.status(201).json({data: asset, message: "Asset details added successfully"});
    } catch (err) {
        console.error("Error creating asset:", err.message);
        return res.status(500).json({error: "Failed to create asset"});
    }
}

async function allAsset(req, res) {
    try {
        const assets = await AssetModel.find({});
        return res.json(assets);
    } catch (err) {
        console.error("Error fetching assets:", err.message);
        return res.status(500).json({error: "Failed to fetch assets"});
    }
}

async function singleAsset(req, res) {
    try {
        const asset = await AssetModel.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({error: 'Asset not found'});
        }
        return res.json(asset);
    } catch (err) {
        console.error("Error fetching asset:", err.message);
        return res.status(500).json({error: "Failed to fetch asset"});
    }
}

async function updateAsset(req, res) {
    try {
        const {id} = req.params;
        let payload = req.body;

        if (req.files && Object.keys(req.files).length > 0) {
            const {assetImageUrl, invoiceImageUrl} = await handleFileUploads(req.files);
            if (assetImageUrl) payload.image_url = assetImageUrl;
            if (invoiceImageUrl) payload.invoice_url = invoiceImageUrl;
        }

        const updatedAsset = await AssetModel.findByIdAndUpdate(id, payload, {new: true});
        if (!updatedAsset) {
            return res.status(404).json({error: "Asset not found"});
        }

        return res.status(200).json({data: updatedAsset, message: "Asset updated successfully"});
    } catch (err) {
        console.error("Error updating asset:", err.message);
        return res.status(500).json({error: "Failed to update asset"});
    }
}

async function deleteAsset(req, res) {
    try {
        const asset = await AssetModel.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({error: "Asset not found"});
        }
        return res.json({message: "Asset deleted successfully"});
    } catch (err) {
        console.error("Error deleting asset:", err.message);
        return res.status(500).json({error: "Failed to delete asset"});
    }
}


module.exports = {addAsset, allAsset, singleAsset, updateAsset, deleteAsset}