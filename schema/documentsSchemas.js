let categoryType=['Activity','Lost and Found'];
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    googleId:String,
    email:String,
    displayName:String,
    photoURL:String,
    accountCreated:Date,
    isAdmin:Boolean,
    activeStatus:{
            type:Boolean,
            Default:true
            },
    requestedForAdmin:{
        type:Boolean,
        Default:false
    }
});
const buzzSchema=new Schema({
    buzz:{ type:String, required:true },
    createdAt:{ type:Date, Default:Date.now, required:true },
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
    like:[{user:{
            type:Schema.Types.ObjectId,
            ref:'userModel'
        }}],
    dislike:[{user:{
            type:Schema.Types.ObjectId,
            ref:'userModel'
        }}],
    category:{
            type:String,
            enum:categoryType,
            required:true
         },
    attachment:String,
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    }
},{autoIndex: false });


const complaintSchema=new Schema({
    department:{
      type:Schema.Types.ObjectId,
        ref:'departmentSchema'
    },
    issueTitle:{
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
        type:String,
        default:"OPEN"
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
    departmentSchema
}
