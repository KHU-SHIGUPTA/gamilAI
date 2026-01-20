const mongoose=require("mongoose");
const userSchema =new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
       type:String,
       required:true
    },profilePhoto:{
        type:String,
        required:true
    },
    googleRefreshToken: {
       type: String,
       //default:null
       require:false
}
,googleName: String,
  googleAvatar: String
},{timestamps:true})
const User=mongoose.model("user",userSchema)
module.exports=User