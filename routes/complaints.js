var express = require('express');
var router = express.Router();
const Models=require('../models/Models');
const Complaints=Models.complaintModel;
const Department=Models.departmentModel;
const User=Models.userModel;
const upload=require('../middlewares/imageUploader');
const cloudinary=require('../services/cloudinary-setup');
const verifyToken=require('../middlewares/jwtVerify');

/* GET users listing. */

router.get('/', verifyToken,(req, res, next)=> {
    Complaints.find({})
        .populate({path:'RaisedBy',model:User,select:'displayName'})
        .populate({path:'department',model: Department,select: 'deptName'})
        .exec((err,complain) =>{
                console.log("complain after populate is :",complain);
                res.send(complain);
            }
        )
});

router.get('/mycomplaints',verifyToken,(req,res,next)=>{
            Complaints.find({RaisedBy: req.user.data},(err,complaints)=>{
                res.send(complaints);
            })
});

router.get('/departments',verifyToken,(req,res)=>{
    Department.find({},(err,department)=>{
        console.log(department);
        res.status(200).send(department);
    });

});

router.post('/',verifyToken,upload.single('attachment'), async (req,res,next)=>{
    const {department,issueTitle,concern,attachment,email}=req.body;
    console.log("------------------------->",req.body);
        let imageURL='';
        if(req.file){
            let imagePath = req.file.path;
            if (imagePath) {
                console.log("image path is :"+imagePath);
                await cloudinary.uploader.upload(imagePath,(err,data)=>{
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
           new Complaints({
               department,
               issueTitle,
               concern,
               RaisedBy:req.user,
               email,
               attachment,
               status:"FILED"
           })
               .save()
               .then(complaints=>{
                   res.send(complaints);
               }).catch(err=>{
                console.log("error in filing complaints..........>"+err);
           });
});
router.patch('/',verifyToken,(req,res,next)=>{
    const {_id:complaintId,assignedTo}=req.body;
            Complaints.updateOne({_id:complaintId},{$set:{'assignedTo':assignedTo}})
                .then(result=>{
                    res.send(result);
                })
});
module.exports = router;
