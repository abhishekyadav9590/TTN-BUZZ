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
const transporter=require('../services/nodemailer-setup');

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
                await cloudinary.uploader.upload(imagePath,(err,data)=>{
                    if (err){
                        res.status(500).send({message:"Image Upload failed"})
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
                                assignedTo=result[0]._id;
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
                            .populate({path: 'RaisedBy', model: User, select: '_id displayName photoURL email'})
                            .populate({path: 'assignedTo', model: User, select: '_id displayName photoURL email'})
                            .populate({path: 'department', model: Department})
                            .then(populatedComplaint => {
                                transporter.sendMail({
                                    from: 'abhishek.yadav@tothenew.com',
                                    to:populatedComplaint.assignedTo.email,
                                    subject: "You have a new complaint to resolve.",
                                    html: "<b>" +
                                        "You have a new complaint to resolve, filed by "+ populatedComplaint.RaisedBy.displayName +" of department "+populatedComplaint.department.deptName
                                        +"</b> <hr><br/> Attachment <img src="+populatedComplaint.attachment+" alt='attachment image'>"

                                });
                                transporter.sendMail({
                                    from: 'abhishek.yadav@tothenew.com',
                                    to: populatedComplaint.RaisedBy.email,
                                    subject: "Your complaint has been filed.",
                                    html: "<b>" +
                                        "Your complaint has been filed and assigned to "+ populatedComplaint.assignedTo.displayName +" of department "+populatedComplaint.department.deptName
                                        +"</b> <hr><br/> Attachment <img src="+populatedComplaint.attachment+" alt='attachment image'>"

                                });
                                res.status(200).send(populatedComplaint);
                            })
                            .catch(err => {
                                console.log("error in filing complaints..........>" + err);
                                res.sendStatus(500);
                            })
                    })
                    .catch(err=>{
                    console.log("error in filing complaints..........Assigned to :>"+err);
                    res.sendStatus(500);
                });
            })
          .catch(err=>{
              res.sendStatus(500);
          })
});

router.patch('/',verifyToken,(req,res,next)=>{
    const {complaintId,complaintStatus}=req.body;
            Complaints.updateOne({_id:complaintId},{$set:{status:complaintStatus}})
                .then(success=>{
                    Complaints.find({_id:complaintId})
                        .populate({path:'RaisedBy',model:User,select:'displayName'})
                        .populate({path:'assignedTo',model:User,select:'displayName'})
                        .populate({path:'department',model: Department,select: 'deptName'})
                        .then(result=>{
                            res.status(200).send(result);
                        })
                })
                .catch(err=>{
                    res.sendStatus(500);
                })

});

module.exports = router;
