const router=require('express').Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
//auth login
//auth with google
router.get('/google',
    passport.authenticate('google',{
       scope:['profile','email'],
       accessType: 'offline'
    })
    );
router.get('/google/redirect',passport.authenticate('google', {failureRedirect: '/google' }),(req,res)=>{
    console.log("Requested User ID : ",req.user);
    const token=jwt.sign({
        data:req.user._id
    },'secret',{expiresIn: '24h'});
    let referer='http://localhost:3001/dashboard/';
    res.cookie("token",token)
    res.redirect(referer);

});

module.exports=router;



