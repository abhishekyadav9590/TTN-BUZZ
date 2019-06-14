const {userSchema,buzzSchema,departmentSchema,complaintSchema}= require('../schema/buzz-schema');
const mongoose=require('mongoose');
var userModel=mongoose.model('users',userSchema);
var buzzModel=mongoose.model('buzz',buzzSchema);
var complaintModel=mongoose.model('complaints',complaintSchema);
var departmentModel=mongoose.model('departments',departmentSchema);
module.exports={
    userModel,
    buzzModel,
    complaintModel,
    departmentModel
}
