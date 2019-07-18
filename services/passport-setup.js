const passport=require("passport");
const GoogleStrategy=require('passport-google-oauth20');
const keys=require('../config/keys');
const Models=require('../models/Models');
const User=Models.userModel;
const mongoose = require('mongoose');
const transporter=require('./nodemailer-setup');


passport.serializeUser((user,done)=>{
    console.log('serialize');
    done(null,user.id);
});

passport.deserializeUser((id, done) =>{
    console.log('Deserialize');
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy({
        //options for googlestrategy
        callbackURL:"/auth/google/redirect",
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
    },(accessToken,refreshToken,profile,done)=>{
        // profile object is returned by Google Auth
        User.findOne({googleId:profile.id})
            .then((existingUser)=>{
                if(existingUser){
                        // user already exist
                    done(null,existingUser);
                }
                else{
                    //creating a new user object to insert in the database
                    new User({
                        googleId:profile.id,
                        email:profile.emails[0].value,
                        displayName:profile.displayName,
                        photoURL: profile.photos[0].value,
                        accountCreated: Date(),
                        isActive:true,
                       department:mongoose.Types.ObjectId('5d121ccafd6e2f8622b48020')

                    })
                        .save()
                        .then(user=>{
                                transporter.sendMail({
                                from: 'abhishek.yadav@tothenew.com',
                                to: profile.emails[0].value,
                                subject: "Thank you for the Registration at TTN BUZZ",
                                html: "<b>Abhishek Yadav .......</b>"
                            });

                            done(null,user);
                        }).catch(err=>{
                            console.log("error in user creation :",err);
                    })
                }
            }).catch(err=>console.log("error in finding accounts",err));

     })
);