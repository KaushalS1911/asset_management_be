const express = require('express')
const router = express.Router()
const {addContract, allContract, singleContract, deleteContract, updateContract} = require("../controllers/contract");


router.post('/', addContract);

router.get('/', allContract);

router.get('/:id', singleContract);

router.put('/:id', updateContract);

router.delete('/:id', deleteContract);

module.exports = router