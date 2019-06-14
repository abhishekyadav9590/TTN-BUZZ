var db_url="mongodb://localhost:27017/ttn-buzz";
const mongoose=require("mongoose");

mongoose.connect(db_url,{useNewUrlParser:true});
var db=mongoose.connection;

var connect=()=>{
    db.on('error.ejs',console.error.bind(console,'connection error'));
    db.once('open',()=>{
        console.log('connected');
    });
}
module.exports={connect};