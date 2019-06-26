var express = require('express');
var router = express.Router();
const Models=require('../models/Models');
const User=Models.userModel;
const verifyToken=require('../middlewares/jwtVerify');

/* GET users listing. */
router.get('/', verifyToken,(req, res, next)=> {
                        let _id=req.user.data;
                        User.findById(_id,(err,user)=>{
                                console.log("user is :"+user);
                                res.send(user);
                        })


        });
module.exports = router;
