const passport=require("passport");
const GoogleStrategy=require('passport-google-oauth20');
const keys=require('../config/keys');
const Models=require('../models/buzzModel');
const User=Models.userModel;


passport.serializeUser((user,done)=>{
   done(null,user.id);
});

passport.deserializeUser((id, done) =>{
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
        console.log('Access Token :'+accessToken);
        console.log('Refresh Token :'+refreshToken);
        console.log('My Name is  :'+profile.displayName);
        console.log('Profile :'+JSON.stringify(profile));

        User.findOne({googleId:profile.id})
            .then((existingUser)=>{
                if(existingUser){
                        // user alrerady exist
                    done(null,existingUser);
                }
                else{
                    new User({
                        googleId:profile.id,
                        email:profile.emails[0].value,
                        displayName:profile.displayName,
                        photoURL: profile.photos[0].value,
                        accountCreated: Date()
                    })
                        .save()
                        .then(user=>{
                            done(null,user);
                        })
                }
            })

     })
);