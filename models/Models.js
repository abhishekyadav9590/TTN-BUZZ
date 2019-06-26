const {userSchema,buzzSchema,departmentSchema,complaintSchema}= require('../schema/documentsSchemas');
const mongoose=require('mongoose');
var userModel=mongoose.model('users',userSchema);
var models=mongoose.model('buzzes',buzzSchema);
var complaintModel=mongoose.model('complaints',complaintSchema);
var departmentModel=mongoose.model('departments',departmentSchema);
module.exports={
    userModel,
    buzzModel: models,
    complaintModel,
    departmentModel
}
