const keys=require('../config/keys');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: keys.gmail.username,
        pass: keys.gmail.password
    }
});

module.exports=transporter;