const db_url="mongodb://localhost:27017/ttn-buzz";
const mongoose=require("mongoose");

mongoose.connect(db_url,{useNewUrlParser:true});
let db=mongoose.connection;

const connect=()=>{
    db.once('open',()=>{
        console.log('connected');
    });
}

mongoose.set('debug',true);
module.exports={connect};