var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
    googleId:String,
    email:String,
    displayName:String,
    photoURL:String,
    accountCreated:Date,
    isAdmin:Boolean,
    requestedForAdmin:Boolean
});
const buzzSchema=new Schema({
    buzzId:{type:Schema.Types.ObjectId},
    buzz:String,
    createdAt:{type:Date, Default:Date.now},
    comments:[{type:Schema.Types.ObjectId,ref:'commentSchema'}],
    reactions:[{type:Schema.Types.ObjectId,ref:'reactionSchema'}],
    category:String,
    attachment:String,
    postedBy:{type:Schema.Types.ObjectId,ref:'userSchema'}
});

var commentSchema=new Schema({
    commentId:String,
    commentText:String,
    buzzId:{type:Schema.Types.ObjectId,ref:'buzzSchema'},
    commentBy:{type:Schema.Types.ObjectId,ref:'userSchema'}
});

var reactionSchema=new Schema({
    reactionId:String,
    reaction:String,
    reactedBy:{type:Schema.Types.ObjectId,ref:'userSchema'}
});
var complaintSchema=new Schema({
    issueID:String,
    deptID:String,
    issueTitle:String,
    email:String,
    concern:String,
    RaisedBy:{type:Schema.Types.ObjectId,ref:'userSchema'},
    assignedTo:{type:Schema.Types.ObjectId,ref:'userSchema'},
    attachment:String,
    status:String,
});
var departmentSchema=new Schema({
    deptID:String,
    deptName:String
});


module.exports={
    userSchema,
    buzzSchema,
    complaintSchema,
    departmentSchema,
    reactionSchema,
    commentSchema
}