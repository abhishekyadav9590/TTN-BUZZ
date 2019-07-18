const router=require('express').Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
const keys=require('../config/keys');
//auth login
//auth with google
router.get('/google',
    passport.authenticate('google',{
       scope:['profile','email'],
       accessType: 'offline'
    })
    );
router.get('/google/redirect',passport.authenticate('google', {failureRedirect: '/google' }),(req,res)=>{
    const token=jwt.sign({
        data:req.user._id
    },keys.jwt.secret/*,{expiresIn: '24h'}*/);
    let referer='http://localhost:3001/token?q='+token;
    res.redirect(referer);

});
module.exports=router;



