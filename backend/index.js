require("dotenv").config(); 
const express=require('express')
const connectDB=require('./db/connectDB')
const cookieParser=require("cookie-parser")
const cors=require('cors')
const userRoute=require('./routes/user.route')
const emailRoute=require("./routes/email.route")
const aiRoute = require("./routes/ai.route");
const authRoute = require("./routes/auth")
const app=express();
const port=8080;

connectDB();
//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser())
 const corsOption={
    // origin:'http://localhost:5173',
  origin: [
    "http://localhost:5173",
    "https://gamil-ai.vercel.app/"
  ],
    credentials:true
 }
 app.use(cors(corsOption))
 app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


 //routes
 app.use("/api/user",userRoute);
 app.use("/api/email",emailRoute);
 app.use("/api/ai", aiRoute); 
 app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoute);
app.use("/api/auth", require("./routes/auth"));

app.listen(port,()=>{
    console.log(`server runing on port ${port}`)
})
