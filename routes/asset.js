const express = require('express');
const router = express.Router();
const multer = require('multer');
const {allAsset, addAsset, deleteAsset, updateAsset, singleAsset} = require("../controllers/asset");

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/', upload.fields([
    {name: 'asset-image', maxCount: 1},
    {name: 'invoice-image', maxCount: 1}
]), addAsset);

router.get('/', allAsset);

router.get('/:id', singleAsset);

router.put('/:id', upload.fields([
    {name: 'asset-image', maxCount: 1},
    {name: 'invoice-image', maxCount: 1}
]), updateAsset);

router.delete('/:id', deleteAsset);

module.exports = router