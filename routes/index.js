const express = require('express');
const router = express.Router();
const ServiceModel = require('../models/services');
const assetRouter = require("../routes/asset")
const serviceRouter = require("../routes/service")
const contractRouter = require("../routes/contract")
const authRouter = require("../routes/auth")
const configRouter = require("../routes/config")

router.use("/auth", authRouter);
router.use("/company", configRouter);
router.use("/company", assetRouter);
router.use("/company", serviceRouter);
router.use("/company", contractRouter);


module.exports = router;

