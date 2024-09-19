const express = require('express');
const router = express.Router();
const multer = require('multer');
const handleException = require("../decorators/error");
const {allAsset, addAsset, deleteAsset, updateAsset, singleAsset,bulkImportAssets} = require("../controllers/asset");

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post("/:companyId/asset/bulk-import", upload.single("asset-file"), bulkImportAssets);
router.post('/:companyId/asset/', upload.fields([
    {name: 'asset-image', maxCount: 1},
    {name: 'invoice-image', maxCount: 1}
]), addAsset);

router.get('/:companyId/asset/', allAsset);

router.get('/:companyId/asset/:id', singleAsset);

router.put('/:companyId/asset/:id', upload.fields([
    {name: 'asset-image', maxCount: 1},
    {name: 'invoice-image', maxCount: 1}
]), updateAsset);

router.delete('/:companyId/asset/:id', deleteAsset);

module.exports = router