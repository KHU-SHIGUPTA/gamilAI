const mongoose=require("mongoose");
const emailSchema =new mongoose.Schema({
    from: {
  type: String,
//   default: ""
},

    to:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
       type:String,
       required:true
    },
    attachments:[
  {
    filename:String,
    path:String,
    cid:String
  }
]
,mailType: {
  type: String,
  enum: ["sent", "inbox"],
  required: true
},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})
module.exports = mongoose.model("Email", emailSchema);