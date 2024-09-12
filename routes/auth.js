const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const {register, login, getCompany} = require("../controllers/auth");


router.post('/register', register);

router.post('/login', login);

router.get('/me', auth , getCompany)


module.exports = router