let express = require('express');
let router = express.Router();
const Models=require('../models/buzzModel');
const Buzz=Models.buzzModel;
const jwt=require('jsonwebtoken');
router.get('/', (req, res, next)=> {
    const token=req.headers.authorization;
    console.log("token on server at users route is : "+token);
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('ERROR: Could not connect to protected route ');
            res.sendStatus(403);
        }
        else{
            console.log("decoded data is : "+JSON.stringify(decoded.data));
            let _id=decoded.data;
            Buzz.find((err,buzzes)=>{
                console.log("buzzes fetched from database is :"+buzzes);
                res.send(buzzes);
            })

        }
    })
});

router.post('/',(req,res,next)=>{
    const token=req.headers.authorization;
    console.log("token on server at users route is : "+token);
    console.log("request body is  : "+JSON.stringify(req.body));
    console.log("request body is  : "+JSON.stringify(req.body.buzz));
    console.log("request headers at servers is  : "+JSON.stringify(req.headers));
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('ERROR: Could not connect to protected route ');
            res.sendStatus(403);
        }
        else{
            console.log("decoded data is : "+JSON.stringify(decoded.data));
                console.log("-----------------");
            new Buzz({
                    buzz:req.body.buzz,
                    createdAt:Date(),
                    category:req.body.category,
                    attachment:req.body.attachment,
                    postedBy:decoded.data,
                })
                    .save()
                    .then(buzz=>{
                       res.send(buzz);
                    })
            }
    })
});

router.delete('/',(req,res,next)=>{
    const token=req.headers.authorization;
    const buzz_id=req.body._id;
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('ERROR: Could not connect to protected route ');
            res.sendStatus(403);
        }
        else {
            Buzz.deleteOne({_id: buzz_id,postedBy: decoded.data})
                .exec()
                .then(result => {
                res.status(200).json({
                  message:'delete'+buzz_id,
                })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        }
    })
});

router.put('/reaction',(req,res,next)=>{
    const token=req.headers.authorization;
    const buzz_id=req.body._id;
    jwt.verify(token,'secret',(err,decoded)=>{
       if(err){
           console.log("ERROR: COULD NOT CONNECT TO PROTECTED ROUTE");
           res.sendStatus(403);
       }
       else{
        let userId=decoded.data;
        let reaction=req.body.reaction;
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
       }
    });
});
router.put('/',(req,res,next)=>{
    const token=req.headers.authorization;
    const buzz_id=req.body._id;
    jwt.verify(token,'secret',(err,decoded)=>{
        if (err){
            console.log("ERROR : COULD NOT CONNECT TO PROTECTED ROUTE");
            res.sendStatus(403);
        }
        else
        {
            try{
                let newComment={
                    commentBy:decoded.data,
                    commentText:req.body.commentText,
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

        }
    })
})
module.exports = router;
