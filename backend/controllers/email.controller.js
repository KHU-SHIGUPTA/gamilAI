const Email=require("../models/email.model")
const nodemailer=require('nodemailer')
const { google } = require("googleapis");
const oauth2Client = require("../config/google");
const User = require("../models/user.model");

async function sendUsingGmailAPI(user, to, subject, htmlMessage, files = []) {

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const boundary = "foo_bar_baz";

  let email = "";
  email += `To: ${to}\r\n`;
  email += `Subject: ${subject}\r\n`;
  email += `MIME-Version: 1.0\r\n`;
  // email += `Content-Type: multipart/related; boundary="${boundary}"\r\n\r\n`;
email += `Content-Type: multipart/related; boundary="${boundary}"; charset="UTF-8"\r\n\r\n`;

  // HTML BODY
  email += `--${boundary}\r\n`;
  email += `Content-Type: text/html; charset="UTF-8"\r\n\r\n`;
  email += `${htmlMessage}\r\n\r\n`;

  // ATTACHMENTS + INLINE IMAGES
  if (files.length > 0) {
    for (const file of files) {
      const fileData = require("fs")
        .readFileSync(file.path)
        .toString("base64");

      email += `--${boundary}\r\n`;
      email += `Content-Type: ${file.mimetype}\r\n`;
      email += `Content-Transfer-Encoding: base64\r\n`;
      email += `Content-Disposition: inline; filename="${file.originalname}"\r\n`;
      email += `Content-ID: <${file.originalname.replace(/\s+/g, "_")}>\r\n\r\n`;
      email += `${fileData}\r\n\r\n`;
    }
  }

  email += `--${boundary}--`;

  const encodedMessage = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage }
  });
}


module.exports.createEmail=async(req,res)=>{
  try {
    const userId=req.id;
    const user = await User.findById(userId);

    const {to,subject,message}=req.body;
    const files = req.files || [];

    if(!to||!subject||!message){
        res.status(400).json({
            message:"All fields are reqiured",
            success:false
        })
    }
    const email=await Email.create({
        to,subject,
        message,
        from:user.email,
        userId,
        mailType: "sent", 
        attachments: req.files.map(file => ({
  filename: file.originalname,
  path: file.path,
  cid: file.originalname.replace(/\s+/g, "_")   // 👈 MATCHES frontend
}))

    })

    // IF user logged in with Google OAuth → use Gmail API
if (user?.googleRefreshToken) {
  await sendUsingGmailAPI(
    user,
    to,
    subject,
    message,
     req.files || []
  );

} else {
  // OTHERWISE USE NODEMAILER (EXISTING CODE)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
      attachments: req.files.map(file => ({
          filename: file.originalname,
          path: file.path,
          cid: file.originalname.replace(/\s+/g, "_"),
          contentDisposition: "inline"
}))

    };
    await transporter.sendMail(mailOptions);

}

      return res.status(201).json({
        success:true,
        message:"email send",
        email
      })
  } catch (error) {
    console.log(error);
  }
}


module.exports.deleteEmail = async (req, res) => {
  try {
    const emailId = req.params.id;
    const gmailId  = req.body?.gmailId;     // ⭐ coming from frontend
    const userId = req.id;

    const user = await User.findById(userId);

    // ⭐ CASE-1 → GOOGLE EMAIL DELETE
    if (user?.googleRefreshToken && gmailId) {
      oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken
      });

      const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
      });

      await gmail.users.messages.trash({
        userId: "me",
        id: gmailId
      });

      return res.status(200).json({
        success: true,
        message: "Email moved to Trash"
      });
    }
    // ⭐ CASE-2 → MANUAL EMAIL DELETE (MongoDB)
    if (!emailId) {
      return res.status(400).json({
        success: false,
        message: "Email ID is required"
      });
    }

    const email = await Email.findByIdAndDelete(emailId);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email deleted successfully"
    });

  } catch (error) {
    console.log("DELETE EMAIL ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete email"
    });
  }
};


//manaual + google
function getFullEmailBody(payload) {
  let body = "";

  // If single part email
  if (payload?.body?.data) {
    body = payload.body.data;
  }

  // If multipart email
  else if (payload?.parts?.length) {
    payload.parts.forEach(part => {
      if (part.mimeType === "text/html" && part.body?.data)
        body = part.body.data;

      else if (part.mimeType === "text/plain" && part.body?.data)
        body = part.body.data;

      // handle nested parts
      if (part.parts?.length) {
        part.parts.forEach(inner => {
          if (inner.body?.data) body = inner.body.data;
        });
      }
    });
  }

  if (!body) return "";

  // Gmail base64 → normal text
  return Buffer
    .from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64")
    .toString("utf-8");
}

module.exports.getAllEmailById = async (req, res) => {
  try {

    const userId = req.id;
    const user = await User.findById(userId);

    // If user logged in manually -> use DB inbox
if (req.provider !== "google") {
  const emails = await Email.find({ userId });
  return res.status(200).json({ emails });
}


    //google login
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client
    });
    
   const list = await gmail.users.messages.list({
  userId: "me",
  maxResults: 100
});

if (!list.data.messages)
  return res.status(200).json({ emails: [] });

let emails = [];

// fetch details FASTER using parallel requests
await Promise.all(
  list.data.messages.map(async (m) => {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: m.id,
      format: "full"
    });
    const labels = detail.data.labelIds || [];
   const isSent = labels.includes("SENT");


const headers = detail.data.payload.headers;

const from = headers.find(h => h.name === "From")?.value || "";
const to = headers.find(h => h.name === "To")?.value || "";
const subject = headers.find(h => h.name === "Subject")?.value || "";
const body = getFullEmailBody(detail.data.payload);

emails.push({
  from,
  to,                     // ✅ REAL receiver
  gmailId: m.id,
  subject,
  message: body,
  mailType: isSent ? "sent" : "inbox",
  attachments: [],
  userId,
  fromGmail: true
});

  })
);
    return res.status(200).json({ emails });

  } catch (error) {
    console.log("GET ALL EMAIL ERROR", error);
    return res.status(500).json({ message: "Failed to load emails" });
  }
};
