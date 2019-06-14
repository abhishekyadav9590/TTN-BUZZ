var express = require('express');
var router = express.Router();
const Models=require('../models/buzzModel');
const User=Models.userModel;
const jwt=require('jsonwebtoken');

/* GET users listing. */
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
                        User.findById(_id,(err,user)=>{
                                console.log("user is :"+user);
                                res.send(user);
                        })

                }
        })
});
module.exports = router;
