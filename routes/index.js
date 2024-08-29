const express = require('express');
const router = express.Router();
const AssetModel = require('../models/assets')
const ServiceModel = require('../models/services')
const multer = require('multer');
const {uploadFile,uploadInvoiceFile} = require("../helpers/images");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/asset',  upload.fields([
  { name: 'asset-image', maxCount: 1 },
  { name: 'invoice-image', maxCount: 1 }
]), async (req, res) => {
    const {
        asset_name,
        asset_type,
        asset_code,
        company,
        seller_name,
        seller_company,
        purchase_date,
        new_refurbish,
        location,
        invoice_no,
        warranty_start_date,
        warranty_end_date,
        remark,
    } = req.body;

    const isExist = await AssetModel.exists({asset_name, asset_type, asset_code})

    if(isExist) {
        res.status(400);
        throw new Error('Asset with entered details already exists.');
    }

  const assetImage = req.files['asset-image'] ? req.files['asset-image'][0] : null;
  const invoiceImage = req.files['invoice-image'] ? req.files['invoice-image'][0] : null;

    const assetImageUrl = await uploadFile(assetImage.buffer);
    const invoiceImageUrl = await uploadInvoiceFile(invoiceImage.buffer);

    const asset = await AssetModel.create({
      asset_name,
      asset_type,
      asset_code,
      company,
      seller_name,
        seller_company,
      purchase_date,
      new_refurbish,
      location,
      invoice_no,
      warranty_start_date,
      warranty_end_date,
      remark,
      image_url: assetImageUrl,
      invoice_url: invoiceImageUrl,
    });

    return res.status(201).json({data: asset, message: "Asset details added successfully", status: 201});
});

router.get("/asset", async (req, res) => {
    const assets = await AssetModel.find({});
    return res.json(assets);
});

router.get("/asset/:id", async (req, res) => {

    const asset = await AssetModel.findById(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    return res.json(asset)
});

router.put("/asset/:id", upload.fields([
  { name: 'asset-image', maxCount: 1 },
  { name: 'invoice-image', maxCount: 1 }
]),async (req, res) => {
    const {id} = req.params;

    const files = req.files;
    let imageUrls = []

    let payload = req.body
    if (files && files.length > 0) {
      const assetImage = req.files['asset-image'] ? req.files['asset-image'][0] : null;
      const invoiceImage = req.files['invoice-image'] ? req.files['invoice-image'][0] : null;

      const assetImageUrl = await uploadFile(assetImage.buffer);
      const invoiceImageUrl = await uploadInvoiceFile(invoiceImage.buffer);
      payload.image_url = assetImageUrl
      payload.invoice_url = invoiceImageUrl
    }

    try {
        const updatedAsset = await AssetModel.findByIdAndUpdate(id, payload, {new: true});

        if (updatedAsset) {
            return res.status(200).json({status: 200, message: "Asset data updated successfully", data: updatedAsset});
        } else {
            res.status(404).json({status: 404, message: "Asset data not found"});
            throw new Error("Asset data not found");
        }
    } catch (err) {
        console.error("Error updating Asset data", err.message);
        return res.status(500).json({message: "Failed to update Asset data", error: err.message})
    }
});

router.delete("/asset/:id", async (req, res) => {

    const asset = await AssetModel.findByIdAndDelete(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error('Asset data not found');
    }

    return res.json({message: "Deleted Successfully"})
});

router.post('/service', async (req, res) => {
  const {
    asset,
    start_date,
    end_date,
    service_by,
    service_person,
    service_person_contact,
    sended_by,
    received_by,
    receiver_contact,
    remark,
    status,
  } = req.body;

  const service = await ServiceModel.create({
    asset,
    start_date,
    end_date,
    service_by,
    service_person,
    service_person_contact,
    sended_by,
    received_by,
    receiver_contact,
    remark,
    status
  });

  return res.status(201).json({data: service, message: "Service details added successfully", status: 201});
});

router.get("/service", async (req, res) => {
  const services = await ServiceModel.find({}).populate('asset');
  return res.json(services);
});

router.get("/service/:id", async (req, res) => {

  const service = await ServiceModel.findById(req.params.id).populate('asset');

  if (!service) {
    res.status(404);
    throw new Error('Service detail not found');
  }

  return res.json(service)
});

router.delete("/service/:id", async (req, res) => {

  const service = await ServiceModel.findByIdAndDelete(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service detail not found');
  }

  return res.json({message: "Deleted Successfully"})
});

router.put('/service/:id', async (req, res) => {

  const {id} = req.params

  try {
    const updatedService = await ServiceModel.findByIdAndUpdate(id, req.body, {new: true});

    if (updatedService) {
      return res.status(200).json({status: 200, message: "Service data updated successfully", data: updatedService});
    } else {
      res.status(404).json({status: 404, message: "Service data not found"});
      throw new Error("Service data not found");
    }
  } catch (err) {
    console.error("Error updating Service data", err.message);
    return res.status(500).json({message: "Failed to update Service data", error: err.message})
  }
});



module.exports = router;
