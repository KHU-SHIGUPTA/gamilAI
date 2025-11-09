const express=require('express')
const dotenv = require('dotenv')
const connectDB=require('./db/connectDB')
const cookieParser=require("cookie-parser")
const cors=require('cors')
const userRoute=require('./routes/user.route')
const emailRoute=require("./routes/email.route")
const app=express();
const port=8080;
dotenv.config();
connectDB();
//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser())
 const corsOption={
    origin:'http://localhost:5173',
    credentials:true
 }
 app.use(cors(corsOption))

 //routes
 app.use("/api/user",userRoute);
 app.use("/api/email",emailRoute)
app.listen(port,()=>{
    console.log(`server runing on port ${port}`)
})