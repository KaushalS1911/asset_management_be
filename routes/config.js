const express = require('express')
const router = express.Router()
const {getConfigs,updateConfigs} = require("../controllers/config");


router.get('/', getConfigs);

router.get('/:id', updateConfigs);


module.exports = router