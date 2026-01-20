const express = require("express");
const router = express.Router();
const oauth2Client = require("../config/google");
const authMiddleware = require("../middleware/isAuthenticated");
const { google } = require("googleapis");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    client_id: process.env.GOOGLE_CLIENT_ID, 
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.send"
    ]
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) return res.status(400).send("Missing code");

    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2"
    });

    const { data } = await oauth2.userinfo.get();

    const user = await User.findOneAndUpdate(
      { email: data.email },
      {
        fullname: data.name,
        email: data.email,
        profilePhoto: data.picture,
        googleRefreshToken: tokens.refresh_token,
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign(
      { userId: user._id ,provider: "google"},
       process.env.JWT_SECRET,
       {expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:false,  
      path: "/",               // <<< IMPORTANt
    });
   return res.redirect("http://localhost:5173/google-success");
  } catch (err) {
    console.log("AUTH ERROR", err.response?.data || err);
    res.status(500).send("Google Authentication Failed");
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.id).select("-password");



  res.json({ user });
});


module.exports = router;
