const jsonweb = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.SECRET;

const middle_ware = (req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.status(400).json({"msg" : "No token, authorization denied"});
    }
    const token_temp = req.headers.authorization.split(" ");
    const token = token_temp[1];
    try {
        req.user = jsonweb.verify(token, secret_key)
        next();
    }
    catch (err) {
        return res.status(401).json({"msg" : "Token is not valid"})
    }
}

module.exports = middle_ware;
