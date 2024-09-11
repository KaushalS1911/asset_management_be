const express = require('express')
const router = express.Router()
const {addService, allService, singleService, deleteService, updateService} = require("../controllers/service");


router.post('/', addService);

router.get('/', allService);

router.get('/:id', singleService);

router.put('/:id', updateService);

router.delete('/:id', deleteService);

module.exports = router