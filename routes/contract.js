const express = require('express')
const router = express.Router()
const {addContract, allContract, singleContract, deleteContract, updateContract} = require("../controllers/contract");


router.post('/:companyId/contract/', addContract);

router.get('/:companyId/contract/', allContract);

router.get('/:companyId/contract/:id', singleContract);

router.put('/:companyId/contract/:id', updateContract);

router.delete('/:companyId/contract/:id', deleteContract);

module.exports = router