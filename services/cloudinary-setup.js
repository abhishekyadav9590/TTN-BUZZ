const cloudinary=require('cloudinary').v2;
const keys=require('../config/keys');

cloudinary.config({
    cloud_name:keys.cloud_name,
    api_key:keys.api_key,
    api_secret:keys.api_secret
});

module.exports=cloudinary;