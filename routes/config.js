const express = require('express')
const router = express.Router()
const {getConfigs,updateConfigs} = require("../controllers/config");


router.get('/:companyId/config', getConfigs);

router.put('/:companyId/config/:id', updateConfigs);


module.exports = router