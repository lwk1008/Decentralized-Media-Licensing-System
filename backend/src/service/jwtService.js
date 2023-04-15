const jwt = require('jsonwebtoken');
const SECRET = "DML test secret";
var jwtService = {};

jwtService.sign = (payload)=>{
    return jwt.sign(payload, SECRET);
}

jwtService.verify = (token)=>{
    return jwt.verify(token, SECRET)
}

module.exports = jwtService;