const _ = require("lodash");
const { TokenExpiredError } = require("jsonwebtoken");
const appJwt = require("../helpers/jwt");
const { ERROR_CODE } = require("../constants/response");
const handleException = require("../decorators/error");
const CompanyModel = require("../models/company")
const {ResourceNotFoundError} = require("../errors/userErrors");

const auth = handleException(async function authenticate(req, res, next) {
    const authHeaders = _.pick(req.headers, ["auth_jwt", "auth_jwt_refresh"]);

    if (
        !authHeaders ||
        !authHeaders["auth_jwt"] ||
        authHeaders["auth_jwt"].length === 0 ||
        !authHeaders["auth_jwt_refresh"] ||
        authHeaders["auth_jwt_refresh"].length === 0
    ) {
        const details = {
            debug_message: "JWT token/ refresh token cookie not found",
        };
        if (authHeaders["auth_jwt_refresh"]) {
            details["error_code"] = ERROR_CODE.AUTH_EXPIRED;
        }
        res.status(401).json({message: "Not Authorised!", status: 401});
    }

    try {
        const decoded = await appJwt.verifyToken(authHeaders["auth_jwt"]);
        const company = await CompanyModel.findById(decoded.id)
        if (
            !company?.other_info ||
            !company?.other_info["jwt"] ||
            company?.other_info["jwt"] !== authHeaders["auth_jwt"]
        ) {
            res.status(401).json({message: "The auth token provided is invalid", status: 401});
        }
        req.user = company;
    } catch (err) {
        if (err instanceof ResourceNotFoundError) {
            res.status(401).json({message: "The requested user is not found OR is not active", status: 404});
        }
        if (err instanceof TokenExpiredError) {
            res.status(401).json({message: "Auth token expired, refresh your token", status: 401});
        }
        res.status(500).json({message: "Something went wrong.", status: 500});
    }

    next();
});

module.exports = auth;
