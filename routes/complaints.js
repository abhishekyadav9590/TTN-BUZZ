var express = require('express');
var router = express.Router();
const Models=require('../models/Models');
const Complaints=Models.complaintModel;
const jwt=require('jsonwebtoken');
const verifyToken=require('../middlewares/jwtVerify');

/* GET users listing. */
router.get('/', verifyToken,(req, res, next)=> {
            Complaints.find((err,complaints)=>{
                res.send(complaints);
            })
});
router.get('/mycomplaints',verifyToken,(req,res,next)=>{
            Complaints.find({RaisedBy: req.user.data},(err,complaints)=>{
                res.send(complaints);
            })
});

router.post('/',verifyToken,(req,res,next)=>{
    const {issueTitle,concern,attachment}=req.body;
           new Complaints({
               issueTitle,
               concern,
               RaisedBy:req.user.data,
               attachment,
               status:"FILED"
           })
               .save()
               .then(complaints=>{
                   res.send(complaints);
               })
});
router.patch('/',verifyToken,(req,res,next)=>{
    const {_id:complaintId,assignedTo}=req.body;
            Complaints.updateOne({_id:complaintId},{$set:{'assignedTo':assignedTo}})
                .then(result=>{
                    res.send(result);
                })
});
module.exports = router;
