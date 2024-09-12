const CompanyModel = require("../models/company")
const {createHash, verifyHash} = require("../helpers/hash")
const {signLoginToken, signRefreshToken} = require("../helpers/jwt")

async function register(req, res) {
    const {name, contact, email, password} = req.body

    const isExist = await CompanyModel.exists({
        email, name
    });

    if (isExist) {
        res.status(400).json({status: 400, message: "Company already exist."});
    }

    const encryptedPassword = await createHash(password);

    const company = new CompanyModel({
        name, contact, email, password: encryptedPassword
    });

    await company.save()

    res.status(201).json({data: company, message: "Registered successfully", status: 201})
}

async function login(req, res) {
    try {
        const {password, email} = req.body
        const company = await CompanyModel.findOne({email})

        if (!company) res.status(404).json({status: 404, message: "Company not found."});

        const isMatch = await verifyHash(password, company.password)

        if (!isMatch) res.status(400).json({status: 400, message: "Invalid credentials."});

        const tokens = await setTokens(company.id)

        res.status(200).json({data: {...company, tokens}, message: "Log in successfully."})
    } catch (err) {
        res.status(500).json({status: 500, message: "Internal Server error"});
    }
}

async function getCompany(req, res) {
    try {
        const {id} = req.user

        // const actualCompanyId = id === 'me' ? req.userid : id

        const company = await CompanyModel.findById(id)

        res.status(200).json({data: company})
    } catch (err) {
        res.status(500).json({status: 500, message: "Internal server error"});
    }
}




function getTokens(companyId) {
    const signedToken = signLoginToken(companyId);
    const refreshToken = signRefreshToken(companyId);
    return {
        jwt: signedToken,
        jwtRefresh: refreshToken,
    };
}

async function setTokens(companyId) {
    const tokens = getTokens(companyId);

    await CompanyModel.findByIdAndUpdate(companyId, {other_info: tokens}, {new: true})

    return getTokens(companyId);
}



module.exports = {register, login, getCompany}