const express = require('express');
const router = express.Router();
const ServiceModel = require('../models/services');
const assetRouter = require("../routes/asset")
const serviceRouter = require("../routes/service")
const contractRouter = require("../routes/contract")

router.use("/asset", assetRouter);
router.use("/service", serviceRouter);
router.use("/contract", contractRouter);


module.exports = router;
