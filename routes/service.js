const express = require('express')
const router = express.Router()
const {addService, allService, singleService, deleteService, updateService} = require("../controllers/service");


router.post('/:companyId/service/', addService);

router.get('/:companyId/service/', allService);

router.get('/:companyId/service/:id', singleService);

router.put('/:companyId/service/:id', updateService);

router.delete('/:companyId/service/:id', deleteService);

module.exports = router