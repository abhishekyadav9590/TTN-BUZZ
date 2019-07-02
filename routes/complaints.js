var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const Models=require('../models/Models');
const Complaints=Models.complaintModel;
const Department=Models.departmentModel;
const User=Models.userModel;
const upload=require('../middlewares/imageUploader');
const cloudinary=require('../services/cloudinary-setup');
const verifyToken=require('../middlewares/jwtVerify');

/* GET users listing. */

router.get('/', verifyToken,(req, res)=> {
    Complaints.find({})
        .populate({path:'RaisedBy',model:User,select:'displayName'})
        .populate({path:'assignedTo',model:User,select:'displayName'})
        .populate({path:'department',model: Department,select: 'deptName'})
        .exec((err,complain) =>{
                res.send(complain);
            }
        )
});

router.get('/mycomplaints',verifyToken,(req,res)=>{
            Complaints.find({RaisedBy: req.user.data},(err,complaints)=>{
                res.send(complaints);
            })
});

router.get('/departments',verifyToken,(req,res)=>{
    Department.find({},(err,department)=>{
        res.status(200).send(department);
    });

});

router.post('/',verifyToken,upload.single('attachment'), async (req,res,next)=>{
    let assignedTo;
    const {department,issueTitle,concern,email}=req.body;
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
      User.find({$and:[{department:department},{isAdmin:true}]})
            .then(result=>{
                if(result.length>0){
                    assignedTo=result[0]._id;
                }
                else{
                    User.find({isSuperAdmin:true})
                        .then(result=>{
                            if(result.length>0){
                                console.log(typeof assignedTo)
                                console.log('assssssssssssssssssssssigned To :',assignedTo)
                                console.log('result-------------->',result[0]._id);
                                assignedTo=result[0]._id;
                                console.log('assssssssssssssssssssssigned To :',assignedTo)
                                console.log(typeof assignedTo)
                            }
                            else
                                assignedTo=req.user;
                        })
                        .catch(err=>console.log("error in assigned to :",err));
                }
                new Complaints({
                    department,
                    issueTitle,
                    concern,
                    RaisedBy:req.user,
                    assignedTo,
                    attachment:imageURL,
                    status:"PENDING"
                })
                    .save()
                    .then(complaints=> {
                        Complaints.findById(complaints._id)
                            .populate({path: 'RaisedBy', model: User, select: '_id displayName photoURL'})
                            .populate({path: 'assignedTo', model: User, select: '_id displayName photoURL'})
                            .populate({path: 'department', model: Department})
                            .then(populatedComplaint => {
                                res.status(200).send(populatedComplaint);
                            })
                            .catch(err => {
                                console.log("error in filing complaints..........>" + err);
                                res.sendStatus(500);
                            })
                    })
                    .catch(err=>{
                    console.log("error in filing complaints..........>"+err);
                    res.sendStatus(500);
                });
            })
          .catch(err=>{
              console.log("error occured in the complaint filling .."+err);
              res.sendStatus(500);
          })
});
router.patch('/',verifyToken,(req,res,next)=>{
    const {complaintId,complaintStatus}=req.body;
            Complaints.findOneAndUpdate({_id:complaintId},{$set:{status:complaintStatus}})
                .populate({path:'RaisedBy',model:User,select:'displayName'})
                .populate({path:'assignedTo',model:User,select:'displayName'})
                .populate({path:'department',model: Department,select: 'deptName'})
                .then(result=>{
                    console.log("resoponse to send to front end is :",result)
                    res.send(result);
                })
});

module.exports = router;
