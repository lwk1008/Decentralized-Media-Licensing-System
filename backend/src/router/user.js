const express = require("express");
const crypto = require("crypto");
const router = express.Router({
    mergeParams: true
})
const db = require('../model/dbconnect');
const loginModel = require('../model/loginModel');

router.get("/current", async(req,res)=>{
    res.send({
        id: 1,
        name: 'DML User(admin)',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    });
});

module.exports = router;