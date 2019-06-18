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
    buzzId:Schema.Types.ObjectId,
    buzz:{
        type:String,
        required:true
    },
    createdAt:{
              type:Date,
              Default:Date.now,
              required:true
              },
    comments:[{
                commentBy:{
                    type:Schema.Types.ObjectId,
                    required:true,
                    ref:'userModel'
                    },
                commentText:{
                    type:String,
                    required:true
                },
                commentedAt:{
                    type:Date,
                    Default: Date.now,
                    required:true
                }
            }],
    reactions:[
        {
            reactor:{
                type:Schema.Types.ObjectId,
                ref:'userModel'
            },
            reaction:{
                type:String,
            }
        }
        ],
    category:{
        type:String,
        required:true
    },
    attachment:String,
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    }
},{autoIndex: false });

let commentSchema=new Schema({
    commentId:String,
    commentText:String,
    buzzId:{type:Schema.Types.ObjectId,ref:'buzzSchema'},
    commentBy:{type:Schema.Types.ObjectId,ref:'userSchema'}
});

const reactionSchema=new Schema({
    reactionId:String,
    reaction:String,
    reactedBy:{type:Schema.Types.ObjectId,ref:'userSchema'}
});
const complaintSchema=new Schema({
    department:{
      type:Schema.Types.ObjectId,
    },
    issueTitle:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    concern:{
        type:String,
        required:true
    },
    RaisedBy:{
        type:Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:'userModel'
    },
    attachment:String,
    status:{
        type:String
    },
});
const departmentSchema=new Schema({
    deptName:{
        type:String,
        required:true
    }
});


module.exports={
    userSchema,
    buzzSchema,
    complaintSchema,
    departmentSchema,
    reactionSchema,
    commentSchema
}