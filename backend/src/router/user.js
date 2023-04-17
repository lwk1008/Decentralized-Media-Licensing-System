const express = require("express");
const crypto = require("crypto");
const router = express.Router({
    mergeParams: true
})
const db = require('../model/dbconnect');
const loginModel = require('../model/loginModel');
const jwt = require("../service/jwtService");

router.get("/current", async(req,res)=>{
    try {
        const token = req.header('Access-Token');
        const decoded = jwt.verify(token);
        const applicantAddress = decoded.publicKey;
        res.send({
            id: 1,
            name: applicantAddress,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        });
    } catch(e){
        res.send({
            id: 1,
            name: 'DML user (admin)',
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        });
    }
    
});

module.exports = router;