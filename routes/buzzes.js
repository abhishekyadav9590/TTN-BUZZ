let express = require('express');
const upload=require('../middlewares/imageUploader');
const cloudinary=require('../services/cloudinary-setup');
let router = express.Router();
const Models=require('../models/Models');
const Buzz=Models.buzzModel;
const User=Models.userModel;
const clearReaction=require('../middlewares/clearReaction');
const verifyToken=require('../middlewares/jwtVerify');


router.get('/', verifyToken,(req, res)=> {
    Buzz.find({})
        .sort({ 'createdAt':-1})
        .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
        .exec()
        .then(buzzes=>{
            res.status(200).send(buzzes);
        })
        .catch(err=>console.log("error in buzz get router"+err))

    });
router.post('/',verifyToken,upload.single('attachment'), async(req,res,next)=>{
    const {buzz,category}=req.body;
    console.log("req.file is :"+req.file);
    const {user:userId}=req;
            let imageURL='';
            if(req.file) {
                if (req.file.path) {
                  await cloudinary.uploader.upload(req.file.path,(err,data)=>{
                      if (err){
                          console.log("error in buzz image upload .",err);
                      }
                      else
                      {
                          imageURL=data.secure_url
                      }
                  });
                }
              }
             new Buzz({
                    buzz,
                    createdAt:Date(),
                    category,
                    attachment:imageURL,
                    postedBy:userId
                }).save()
                   .then(buzz=>{
                       Buzz.findById(buzz._id)
                           .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
                           .then(buzzes=>{
                               res.status(200).send(buzzes);
                           })
                           .catch(err=>console.log("error in buzz get router"+err))

                   }).catch(err=>{
                        console.log("error in saving buzz to db "+err);
                        res.sendStatus(500);
             })
    });

router.delete('/',verifyToken,(req,res,next)=>{
    const {_id:buzzId,user:userId}=req.body;
    Buzz.deleteOne({_id: buzzId,postedBy: userId})
        .exec()
        .then(result => {
            res.send(buzzId);
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
                           res.sendStatus(500);
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
                        console.log(success);
                    }
                })
        }catch (e) {
                res.sendStatus(500);
                console.log("error : "+e);
            }
})

router.put('/like',verifyToken,clearReaction,(req,res,next)=>{
   const {buzzId} = req.body.data;
    const {user} =req.body;
   Buzz.find({$and:[{_id:buzzId},{'like.user':user}]})
       .then(result=>{
        if(result.length){
            let userDelete={user}
            Buzz.findOneAndUpdate({_id:buzzId},
                {$pull:{like:userDelete}},{new:true})
                .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
                .then(result=>{
                    console.log("------------->",result);
                    res.status(200).send(result);
                })
                .catch(err=>{
                    res.sendStatus(500);
                })
        }
        else {
            let like = {user};
            Buzz.findOneAndUpdate({_id: buzzId},
                {$push: {like}},{new:true})
                .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
                .then(data => {
                    res.send(data)
                })
                .catch(err => {
                    res.sendStatus(500);
                })

        }
       })
       .catch(err=>{
           res.sendStatus(500);
       });

});

router.put('/dislike',verifyToken, clearReaction, (req,res,next)=>{
    const {buzzId} = req.body.data;
    const {user} =req.body;
    Buzz.find({$and:[{_id:buzzId},{'dislike.user':user}]})
        .then(result=>{
            if(result.length){
                let deletedislike={user}
                Buzz.findOneAndUpdate({_id:buzzId},
                    {$pull:{dislike:deletedislike}},{new:true})
                    .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
                    .then(result=>{
                        res.status(200).send(result)
                    })
                    .catch(err=>{
                        res.sendStatus(500);
                    })
            }
            else
            {
                let dislike={user};
                Buzz.findOneAndUpdate({_id:buzzId},
                    {$push:{dislike}},{new:true})
                    .populate({path:'postedBy',model:User,select:'_id displayName photoURL'})
                    .then(data=>res.send(data))
                    .catch(err=>console.log(err))
            }
        })
        .catch(err=>{
            res.sendStatus(500);
        });

});
module.exports = router;
