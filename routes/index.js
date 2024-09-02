const express = require('express');
const router = express.Router();
const multer = require('multer');
const AssetModel = require('../models/assets');
const ServiceModel = require('../models/services');
const { uploadFile, uploadInvoiceFile } = require('../helpers/images');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function handleFileUploads(files) {
    const assetImage = files['asset-image'] ? files['asset-image'][0] : null;
    const invoiceImage = files['invoice-image'] ? files['invoice-image'][0] : null;

    const assetImageUrl = assetImage ? await uploadFile(assetImage.buffer) : null;
    const invoiceImageUrl = invoiceImage ? await uploadInvoiceFile(invoiceImage.buffer) : null;

    return { assetImageUrl, invoiceImageUrl };
}

router.post('/asset', upload.fields([
    { name: 'asset-image', maxCount: 1 },
    { name: 'invoice-image', maxCount: 1 }
]), async (req, res) => {
    try {


        const isExist = await AssetModel.exists({ asset_name, asset_type, asset_code });
        if (isExist) {
            return res.status(400).json({ error: 'Asset with entered details already exists.' });
        }

        const { assetImageUrl, invoiceImageUrl } = await handleFileUploads(req.files);

        const asset = await AssetModel.create({...req.body,image_url: assetImageUrl, invoice_url: invoiceImageUrl});

        return res.status(201).json({ data: asset, message: "Asset details added successfully" });
    } catch (err) {
        console.error("Error creating asset:", err.message);
        return res.status(500).json({ error: "Failed to create asset" });
    }
});

router.get('/asset', async (req, res) => {
    try {
        const assets = await AssetModel.find({});
        return res.json(assets);
    } catch (err) {
        console.error("Error fetching assets:", err.message);
        return res.status(500).json({ error: "Failed to fetch assets" });
    }
});

router.get('/asset/:id', async (req, res) => {
    try {
        const asset = await AssetModel.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        return res.json(asset);
    } catch (err) {
        console.error("Error fetching asset:", err.message);
        return res.status(500).json({ error: "Failed to fetch asset" });
    }
});

router.put('/asset/:id', upload.fields([
    { name: 'asset-image', maxCount: 1 },
    { name: 'invoice-image', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        let payload = req.body;

        if (req.files && Object.keys(req.files).length > 0) {
            const { assetImageUrl, invoiceImageUrl } = await handleFileUploads(req.files);
            if (assetImageUrl) payload.image_url = assetImageUrl;
            if (invoiceImageUrl) payload.invoice_url = invoiceImageUrl;
        }

        const updatedAsset = await AssetModel.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedAsset) {
            return res.status(404).json({ error: "Asset not found" });
        }

        return res.status(200).json({ data: updatedAsset, message: "Asset updated successfully" });
    } catch (err) {
        console.error("Error updating asset:", err.message);
        return res.status(500).json({ error: "Failed to update asset" });
    }
});

router.delete('/asset/:id', async (req, res) => {
    try {
        const asset = await AssetModel.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }
        return res.json({ message: "Asset deleted successfully" });
    } catch (err) {
        console.error("Error deleting asset:", err.message);
        return res.status(500).json({ error: "Failed to delete asset" });
    }
});

router.post('/service', async (req, res) => {
    try {
        const {
            asset, start_date, end_date, service_by, service_person,
            service_person_contact, sended_by, received_by, receiver_contact,
            remark, status
        } = req.body;

        const service = await ServiceModel.create({
            asset, start_date, end_date, service_by, service_person,
            service_person_contact, sended_by, received_by, receiver_contact,
            remark, status
        });

        return res.status(201).json({ data: service, message: "Service details added successfully" });
    } catch (err) {
        console.error("Error creating service:", err.message);
        return res.status(500).json({ error: "Failed to create service" });
    }
});

router.get('/service', async (req, res) => {
    try {
        const services = await ServiceModel.find({}).populate('asset');
        return res.json(services);
    } catch (err) {
        console.error("Error fetching services:", err.message);
        return res.status(500).json({ error: "Failed to fetch services" });
    }
});

router.get('/service/:id', async (req, res) => {
    try {
        const service = await ServiceModel.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        return res.json(service);
    } catch (err) {
        console.error("Error fetching service:", err.message);
        return res.status(500).json({ error: "Failed to fetch service" });
    }
});

router.put('/service/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedService = await ServiceModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.status(200).json({ data: updatedService, message: "Service updated successfully" });
    } catch (err) {
        console.error("Error updating service:", err.message);
        return res.status(500).json({ error: "Failed to update service" });
    }
});

router.delete('/service/:id', async (req, res) => {
    try {
        const service = await ServiceModel.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.json({ message: "Service deleted successfully" });
    } catch (err) {
        console.error("Error deleting service:", err.message);
        return res.status(500).json({ error: "Failed to delete service" });
    }
});

module.exports = router;
