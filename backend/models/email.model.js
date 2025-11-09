const mongoose=require("mongoose");
const emailSchema =new mongoose.Schema({
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
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})
module.exports = mongoose.model("Email", emailSchema);