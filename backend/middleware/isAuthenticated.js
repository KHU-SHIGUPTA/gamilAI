const jwt=require("jsonwebtoken");
const isAuthenticated=async(req,res,next)=>{
   try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decoded.userId || decoded.id;
     req.provider = decoded.provider;
    next();
  } catch (err) {
    console.log("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid Token" });
  }
}
module.exports = isAuthenticated;
