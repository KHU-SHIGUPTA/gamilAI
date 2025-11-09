const mongoose=require("mongoose")
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.Mongo_URI);
        console.log("mongo db connect");
    }
    catch(error){
        console.log(error)
    }
}
module.exports = connectDB;   