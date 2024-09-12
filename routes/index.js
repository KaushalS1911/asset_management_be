const express = require('express');
const router = express.Router();
const ServiceModel = require('../models/services');
const assetRouter = require("../routes/asset")
const serviceRouter = require("../routes/service")
const contractRouter = require("../routes/contract")
const authRouter = require("../routes/auth")
const configRouter = require("../routes/config")

router.use("/auth", authRouter);
router.use("/company/:companyId/config", configRouter);
router.use("/company/:companyId/asset", assetRouter);
router.use("/company/:companyId/service", serviceRouter);
router.use("/company/:companyId/contract", contractRouter);


module.exports = router;
