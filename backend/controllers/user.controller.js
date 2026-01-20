const User=require("../models/user.model")
const bycrpt=require("bcryptjs")
const jwt=require("jsonwebtoken")
module.exports.register=async(req,res)=>{
  try {
    const {fullname,email,password}=req.body;
    if(!fullname||!email||!password){
        return res.status(400).json({message:"All fields are required",success:false})
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({message:"User already exist with this email",success:false});
    }
    const hashedPassword= await bycrpt.hash(password,10);
    const profilePhoto=`https://avatar.iran.liara.run/public/girl`
    await User.create({
        fullname,
        email,
        password:hashedPassword,
        profilePhoto
    });
    return res.status(201).json({
        message:"Account created successfully",
        success:true
    })
  } catch (error) {
     console.log(error)
  }
}
//old
// module.exports.login=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         if(!email||!password){
//             return res.status(400).json({message:"All fields are require",success:false})
//          }
//         // const user=await User.findOne({email});
//        const user=await User.findOneAndUpdate(
//               { email: data.email },
//               {
//                 name: data.name,
//                email: data.email,
//                picture: data.picture,
//                googleRefreshToken: tokens.refresh_token
//               },
//               { upsert: true }
//            );

//         if(!user){
//             return res.status(400).json({message:"Incorrect email or password",success:false})
//         }
//         const isPasswordMatch=await bycrpt.compare(password,user.password);
//         if(!isPasswordMatch){
//              return res.status(400).json({message:"Incorrect email or password",success:false})
//         }
//         const tokendata={
//             userId:user._id
//         }
//         const token=await jwt.sign(tokendata,process.env.Secret_KEY,{expiresIn:"1d"})
//         res.status(200).cookie('token',token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
//             user,
//             message:`${user.fullname} logged in successfully`,
//             success:true
//         })
//     }
//     catch(error){
//       console.log(error);
//     }
// }

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });

    const user = await User.findOne({ email });

    if (!user || !user.password)
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });

    const isPasswordMatch = await bycrpt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });

    const token = jwt.sign(
      { userId: user._id ,provider: "local"},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        //checking
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        user,
        message: `${user.fullname} logged in successfully`,
        success: true
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed" });
  }
};


module.exports.logout=async(req,res)=>{
    try{
          return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successfully"
          })
    }
    catch(error){
        console.log(error);
    }
}