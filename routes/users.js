var express = require('express');
var router = express.Router();
const Models=require('../models/Models');
const User=Models.userModel;
const upload=require('../middlewares/imageUploader');
const cloudinary=require('../services/cloudinary-setup');
const Department=Models.departmentModel;
const verifyToken=require('../middlewares/jwtVerify');

/* GET users listing. */
router.get('/', verifyToken,(req, res)=> {
                        let _id=req.user;
                        User.findById(_id)
                            .populate({path:'department',model:Department})
                            .then(data=>{
                                res.status(200).send(data);
                            })
                            .catch(err=>console.log(err));
});
router.get('/all',verifyToken,(req,res)=>{
    const depart_id=req.body.department_id;
    User.find({'department._id':depart_id})
        .sort({'displayName':1})
        .then(data=>{
            res.status(200).send(data)
        })
        .catch(err=>console.log(err))
});
router.post('/',verifyToken,upload.single('attachment'),async (req,res)=>{
    const userId=req.user;
    console.log("data from client is :",req.body);
    console.log("data from client is :",req.user);
    console.log("data from client is :"+req.file);

    let imageURL='https://erp.psit.in/assets/img/Simages/20745.jpg';
        if(req.file) {
            if (req.file.path) {
                await cloudinary.uploader.upload(req.file.path,(err,result)=>{
                    if (err){
                        console.log("error in buzz image upload .",err);
                    }
                    else
                    {
                        imageURL=result.secure_url
                    }
                });
            }
        }
    User.updateOne({_id:userId},{$set:{photoURL:imageURL}})
        .populate({path:'department',model:Department})
        .then(result=>{
            User.findById(userId)
                .populate({path:'department',model:Department})
                .then(data=>{
                    res.status(200).send(data);
                })
                .catch(err=>console.log(err));
        })
        .catch(err=>console.log("error ",err));
});
module.exports = router;
