const Email=require("../models/email.model")
module.exports.createEmail=async(req,res)=>{
  try {
    const userId=req.id;
    const {to,subject,message}=req.body;
    if(!to||!subject||!message){
        res.status(400).json({
            message:"All fields are reqiured",
            success:false
        })
    }
    const email=await Email.create({
        to,subject,
        message,
        userId
    })
      return res.status(201).json({
        email
      })
  } catch (error) {
    console.log(error);
  }
}
module.exports.deleteEmail=async (req,res) =>{
    try {
        const emailId=req.params.id;
        if(!emailId){
            return res.status(400).json({
                message:"email id is required"
            })
        }
        const email=await Email.findByIdAndDelete(emailId);
        if(!email){
             return res.status(404).json({
                message:"email  is not found"
            })
        }
        return res.status(201).json({
            message:"email deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports.getAllEmailById=async(req,res)=>{
 try {
    const userId=req.id;
    
    const emails=await Email.find({userId});

    return res.status(200).json({
        emails
    })
 } catch (error) {
    console.log(error);
 }
}