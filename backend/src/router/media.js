const express = require("express");
const router = express.Router({
    mergeParams: true
})
const db = require('../model/dbconnect');
const mediaModel = require('../model/mediaModel');
const web3Service = require("../service/web3Service");

router.post("/createMedia", async(req,res)=>{
    try{
        const nftAddress = req.body.nftAddress;
        const nftTokenId = req.body.nftTokenId;
        const oscAddress = req.body.oscAddress;

        var cachedMetadata = await web3Service.getNFTMetadata(nftAddress, parseInt(nftTokenId));
        //console.log(cachedMetadata);
        if(cachedMetadata == undefined) throw "Cannot get metadata"
        //Store it in mongo
        var doc = await mediaModel.create({ 
            nftAddress: nftAddress,
            nftTokenId: nftTokenId,
            oscAddress: oscAddress,
            cachedMetadata: cachedMetadata
        });

        var jsonResult = {
            "msg": "successfully create media",
            "data": {
                "info": cachedMetadata
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. Create media failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }


});

router.get("/info", async(req,res)=>{
    try{
        const mediaId = req.query.id;

        const filter = { mediaId };
        
        //get the nonce from mongo
        const doc = await mediaModel.findOne(filter).exec();
        if(doc == null)throw "media not found in db";

        var jsonResult = {
            "msg": "successfully get the media metadata by id",
            "data": {
                "info": JSON.parse(doc.cachedMetadata),
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. get media metadata by id failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});

router.get("/allinfo", async(req,res)=>{
    try{
        const filter = {};
        const doc = await mediaModel.find(filter).sort('mediaId').exec();
        //if(doc.length == 0)throw "no media in db";
        //console.log("Doc getted:"+doc);

        var jsonResult = {
            "msg": "successfully get the media metadata by id",
            "data": {
                "mediaBody": doc.map((row) => {
                    return {
                        id: row.id,
                        mediaId: row.mediaId,
                        ...JSON.parse(row.cachedMetadata),
                    };
                })
            }
        }
        res.status(200).send(jsonResult);

    }catch(e){
        var jsonResult = {
            "msg": "Error. get media metadata by id failed!",
            "data": e.toString()
        }
        console.log(jsonResult);
        res.status(500).send(jsonResult);
    }
});



/*
router.get("/allinfo", async(req,res)=>{
    res.send([
        {
            id: '1',
            mediaName: 'Media 1',
            image: 'http://via.placeholder.com/640x360',
            licenses: [
                'License 1',
                'License 2',
                'License 3',
            ],
        },
        {
            id: '2',
            mediaName: 'Media 2',
            image: 'http://via.placeholder.com/640x360',
            licenses: [
                'License 1',
                'License 2',
                'License 3',
            ],
        },
        {
            id: '3',
            mediaName: 'Media 3',
            image: 'http://via.placeholder.com/640x360',
            licenses: [
                'License 1',
                'License 2',
                'License 3',
            ],
        },
    ]);
});*/



module.exports = router;