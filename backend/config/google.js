require("dotenv").config();
const { google } = require("googleapis");
//console.log(process.env.GOOGLE_CLIENT_ID);
//onsole.log(process.env.GOOGLE_REDIRECT_URI);
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

module.exports = oauth2Client;
