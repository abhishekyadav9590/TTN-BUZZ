var express = require('express');
var router = express.Router();
const Models=require('../models/buzzModel');
const Buzz=Models.buzzModel;
const jwt=require('jsonwebtoken');
router.get('/', (req, res, next)=> {
    const token=req.headers.authorization;
    console.log("token on server at users route is : "+token);
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('ERROR: Could not connnect to protected route ');
            res.sendStatus(403);
        }
        else{
            console.log("decoded data is : "+JSON.stringify(decoded.data));
            let _id=decoded.data;
            Buzz.find((err,buzzes)=>{
                console.log("buzzes fetched from databse is :"+buzzes);
                res.send(buzzes);
            })

        }
    })
});

router.post('/',(req,res,next)=>{
    const token=req.headers.authorization;
    console.log("token on server at users route is : "+token);
    console.log("requst body is  : "+JSON.stringify(req.body));
    console.log("requst body is  : "+JSON.stringify(req.body.buzz));
    console.log("requst headers at servers is  : "+JSON.stringify(req.headers));
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('ERROR: Could not connnect to protected route ');
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
            console.log('ERROR: Could not connnect to protected route ');
            res.sendStatus(403);
        }
        else {
            Buzz.remove({_id: buzz_id,postedBy: decoded.data})
                .exec()
                .then(result => {
                res.status(200).json({
                  message:'delete',
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
module.exports = router;
