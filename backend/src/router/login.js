const express = require("express");
const crypto = require("crypto");
const router = express.Router({
    mergeParams: true
})
const web3 = require("../service/web3Service");
const ethSigUtil = require('eth-sig-util');
const ethJsUtil = require('ethereumjs-util');
const db = require('../model/dbconnect');
const loginModel = require('../model/loginModel');
const jwt = require("../service/jwtService");
const { exception } = require("console");

router.post("/nonce", async(req,res)=>{
    try{
        var token = crypto.randomBytes(64).toString('hex');
        var nonceObj = {
            nonce: token,
            publicKey: req.body.publicKey.toLowerCase()
        }
        const option = {
            new: true,
            upsert: true
        };
        const filter = { publicKey: req.body.publicKey.toLowerCase() };
        const doc = await loginModel.findOneAndUpdate(filter, nonceObj,option);
        var jsonResult = {
            "msg": "successfully get the nonce",
            "data": {
                "nonce": doc.nonce
            }
        }
        res.status(200).send(jsonResult);
    }catch(e){
        var jsonResult = {
            "msg": "Error. Get Nonce failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

router.post("/verify", async(req,res)=>{
    try{
        const publicKey = req.body.publicKey.toLowerCase();
        const signature = req.body.signature;
        const filter = { publicKey: publicKey };
        
        //get the nonce from mongo
        const doc = await loginModel.findOne(filter).exec();
        //console.log(doc);

        const msgBufferHex = ethJsUtil.bufferToHex(Buffer.from(doc.nonce, 'utf8'));
        const address = ethSigUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicKey.toLowerCase()) {
            //jwt
            var dataJwt = jwt.sign({publicKey: publicKey.toLowerCase()});
        }else{
            throw new exception("Signature incorrect");
        }


        var jsonResult = {
            "msg": "successfully get the nonce",
            "data": {
                "jwt": dataJwt
            }
        }
        res.status(200).send(jsonResult);
    }catch(e){
        var jsonResult = {
            "msg": "Error. Login Verify failed!",
            "data": e.toString()
        }
        res.status(500).send(jsonResult);
    }
});

module.exports = router;