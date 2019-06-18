var express = require('express');
var router = express.Router();
const Models=require('../models/buzzModel');
const Complaints=Models.complaintModel;
const jwt=require('jsonwebtoken');

/* GET users listing. */
router.get('/', (req, res, next)=> {
    const token=req.headers.authorization;
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            Complaints.findById(_id,(err,complaints)=>{
                res.send(complaints);
            })

        }
    })
});
router.post('/',(req,res,next)=>{
    const token=req.headers.authorization;
    jwt.verify(token,'secret',(err,decoded)=>{
       if (err){
           res.sendStatus(403);
       }
       else
       {
           new Complaints({

           })
       }
    });
});
module.exports = router;
