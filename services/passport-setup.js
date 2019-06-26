const passport=require("passport");
const GoogleStrategy=require('passport-google-oauth20');
const keys=require('../config/keys');
const Models=require('../models/Models');
const User=Models.userModel;


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
        User.findOne({googleId:profile.id})
            .then((existingUser)=>{
                if(existingUser){
                        // user already exist
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