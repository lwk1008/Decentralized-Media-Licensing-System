const express = require("express");
const router = express.Router({
    mergeParams: true
});
const crypto = require("crypto");
const db = require('../model/dbconnect');
const rafModel = require('../model/rafModel');
const mediaModel = require('../model/mediaModel');
const jwt = require("../service/jwtService");
const web3Service = require("../service/web3Service");

router.post("/create", async(req,res)=>{
    try{
        const mediaId = req.body.doc.mediaId;
        const license = req.body.doc.license;
        const licenseName = req.body.doc.licenseName;
        const applicant = req.body.doc.applicant;
        const usage = req.body.doc.usage;
        const dateOfUse = req.body.doc.dateOfUse;
        const applicationSignature = req.body.doc.applicationSignature;
        console.log(applicationSignature);
        //jwt
        const token = req.header('Access-Token');
        const decoded = jwt.verify(token);
        const applicantAddress = decoded.publicKey;
        
        //get approver address
        const filter = { mediaId: mediaId };
        
        //get the nonce from mongo
        var mediaDoc = await mediaModel.findOne(filter).exec();
        if(mediaDoc == null)throw "media not found in db";
        const nftAddress = mediaDoc.nftAddress;
        const nftTokenId = mediaDoc.nftTokenId;
        const approverAddress = await web3Service.getApproverAddress(nftAddress,nftTokenId);
        
        const status = 0;
        
        //hash
        var data = applicant+usage+dateOfUse+license+applicantAddress;
        var hash = crypto.createHash("sha256").update(data).digest('hex'); ;

        
        //Store it in mongo
        var doc = await rafModel.create({ 
            mediaId: mediaId,
            license: license,
            licenseName: licenseName,
            applicant: applicant,
            usage: usage,
            dateOfUse: dateOfUse,
            applicantAddress: applicantAddress,
            status: status,
            hash: hash,
            approverAddress: approverAddress,
            applicationSignature: applicationSignature
        });
        console.log(doc);
        var jsonResult = {
            "msg": "successfully create raf",
            "data": {
                "hash": hash
            }
        }
        res.status(200).send(jsonResult);
    }catch(e){
        var jsonResult = {
            "msg": "Error.create raf failed!",
            "data": e.toString()
        }
        res.status(500).send(jsonResult);
    }
});

router.get("/rafbyaddress", async(req,res)=>{
    try{
        //jwt
        const token = req.header('Access-Token');
        const decoded = jwt.verify(token);
        const address = decoded.publicKey;

        const filter = { applicantAddress: address};
        
        //get the nonce from mongo
        const doc = await rafModel.find(filter).exec();

        // If approved or rejected
        if(doc.status != 0 ){

            
        }

        var jsonResult = {
            "msg": "successfully get the raf by address",
            "data": { 
                "doc": doc
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. get raf by address failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

router.get("/rafToApproveByaddress", async(req,res)=>{
    try{
        //jwt
        const token = req.header('Access-Token');
        const decoded = jwt.verify(token);
        const address = decoded.publicKey;

        const filter = { approverAddress: address};
        
        //get the nonce from mongo
        const doc = await rafModel.find(filter).exec();

        var jsonResult = {
            "msg": "successfully get the raf by address",
            "data": { 
                "doc": doc
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. get raf by address failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

router.get("/rafbyhash", async(req,res)=>{
    try{
        const filter = { hash: req.query.hash };
        
        //get the nonce from mongo
        const doc = await rafModel.findOne(filter).exec();
        if(doc == null ) throw "RAF not found";

        var signature = "";
        if(doc.status != 0 ){
            signature = await web3Service.getSignatureAndVerify(doc, doc.hash, doc.approverAddress);
            signature = signature[0];
        }
        doc.approverSignature = signature;

        var jsonResult = {
            "msg": "successfully get the raf by hash",
            "data": { 
                "doc": doc
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. get raf by hash failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

router.post("/update", async(req,res)=>{
        try{
        if(req.body.status != 1 && req.body.status !=2) throw "Status only can be 1  or 2";
        
        const filter = { hash: req.body.hash };
        const update = { $set: { status: req.body.status} };
        const doc = await rafModel.findOneAndUpdate(filter, update);
        if(doc == null ) throw "RAF not found";

        var jsonResult = {
            "msg": "successfully update the raf by hash"
        }
        res.status(200).send(jsonResult);
    
    }catch(e){
        var jsonResult = {
            "msg": "Error. get raf by hash failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

module.exports = router;
