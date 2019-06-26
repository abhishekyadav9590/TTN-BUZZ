let express = require('express');
const upload=require('../middlewares/imageUploader');
const cloudinary=require('cloudinary').v2;
let router = express.Router();
const Models=require('../models/Models');
const Buzz=Models.buzzModel;
const verifyToken=require('../middlewares/jwtVerify');
router.get('/', verifyToken,(req, res, next)=> {
            Buzz.find((err,buzzes)=>{
                res.send(buzzes);
            })


    });
router.post('/',verifyToken,upload.single('attachment'), async(req,res,next)=>{
    const {buzz,category}=req.body;
            let imageURL='paddedToTest';
            if(req.file) {
                let imagePath = req.file.path;
                if (imagePath) {
                  await cloudinary.uploader.upload(imagePath)
                        .then(result => {
                            imageURL = result.secure_url
                        }
                    ).catch(err => {
                        console.log("image upload failed"+err);
                        res.sendStatus(304);
                    });
                }
              }

             new Buzz({
                    buzz,
                    createdAt:Date(),
                    category,
                    attachment:imageURL,
                    postedBy:req.user.data,
                })
                    .save()
                    .then(buzz=>{
                       res.send(buzz);
                    })
    });

router.delete('/',verifyToken,(req,res,next)=>{
    const buzz_id=req.body._id;
    Buzz.deleteOne({_id: buzz_id,postedBy: req.user.data})
        .exec()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

    });

router.put('/reaction',verifyToken,(req,res,next)=>{
        let {data:userId}=req.user;
        const {_id:buzz_id,reaction}=req.body;
        Buzz.find({
            $and:[{_id: buzz_id},{'reactions.reactor':userId}]})
            .then((alreadyreacted)=>{
                if (alreadyreacted){
                   Buzz.updateOne({_id:buzz_id,'reactions.reactor':userId},{$set:{'reactions.$.reaction':reaction}},(err,success)=>{
                       if (err) {
                           res.sendStatus(304);
                       }
                       else {
                           res.send(success);
                       }
                   })
                }
               else{
                    try{
                        let newReaction={reactor: userId,reaction};
                        Buzz.updateOne({_id:buzz_id},
                            {$push:{reactions: newReaction}},(err,success)=>{
                            if (err) {
                                console.log("error in storing reactions" + err);
                                res.sendStatus(304);
                            }
                            else {
                                console.log("hurrah ! reaction stored successfully. " + JSON.stringify(success));
                                res.send(success);
                            }
                            })
                    }catch (e) {
                        console.log("error in storing reactions :"+e)
                    }
                }
            })
            .catch(err=>{
                res.sendStatus(304);
            })
    });
router.put('/',verifyToken,(req,res,next)=>{
    const {_id:buzz_id,commentText}=req.body;
    const {data:userId}=req.user;
            try{
                let newComment={
                    commentBy:userId,
                    commentText:commentText,
                    commentedAt: Date.now()
                }
                Buzz.updateOne({_id:buzz_id},
                    {$push:{comments:newComment}},(err,success)=>{
                    if (err){
                        console.log("error in commenting :"+err);
                    }
                    else
                    {
                        console.log("success"+success);
                    }
                })
        }catch (e) {
                console.log("error : "+e);
            }
})
module.exports = router;
