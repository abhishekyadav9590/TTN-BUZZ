const {userSchema,buzzSchema,departmentSchema,complaintSchema,issueTypeSchema}= require('../schema/documentsSchemas');
const mongoose=require('mongoose');
const userModel=mongoose.model('users',userSchema);
const buzzModel=mongoose.model('buzzes',buzzSchema);
const complaintModel=mongoose.model('complaints',complaintSchema);
const departmentModel=mongoose.model('departments',departmentSchema);

module.exports={
    userModel,
    buzzModel,
    complaintModel,
    departmentModel,
}
