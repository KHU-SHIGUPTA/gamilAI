const axios = require("axios");
module.exports.generateEmailWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const flaskUrl = process.env.GEMINI_FLASK_LITE_URL;
    if (!flaskUrl) {
      console.error("GEMINI_FLASK_LITE_URL is missing in backend .env");
      return res.status(500).json({
        success: false,
        message: "GEMINI_FLASK_LITE_URL is not set in backend .env",
      });
    }

    console.log("Calling Flask Lite:", flaskUrl, "with prompt:", prompt);

    const flaskResponse = await axios.post(flaskUrl, {
      input: prompt,          // ⬅️ matches Flask generate() reading data.get("input")
    });

    console.log("Flask response status:", flaskResponse.status);
    const data = flaskResponse.data;

    if (!data || !data.text) {
      return res.status(500).json({
        success: false,
        message: "Flask Lite did not return 'text'",
        raw: data,
      });
    }

    return res.status(200).json({
      success: true,
      generatedEmail: data.text,  // ⬅️ frontend uses this
    });
  } catch (error) {
    console.error("Error calling Gemini Flask Lite:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate email with AI",
      detail: error.response?.data || error.message,
    });
  }
};

module.exports.summarizeEmailWithAI = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Email text is required",
      });
    }

    const flaskUrl = process.env.GEMINI_FLASK_LITE_URL;
    if (!flaskUrl) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_FLASK_LITE_URL missing",
      });
    }

//     const aiPrompt = `
// Summarize the following email clearly in 3–5 bullet points:

// ${text}
// `;

const aiPrompt = `
You are an AI assistant helping users quickly understand emails.

TASK:
Write a concise, professional summary of the email below.

RULES:
- Do NOT add introductions or headings
- Do NOT mention the number of bullet points
- Use clear, neutral, professional language
- Use bullet points with "•" (not hyphens or asterisks)
- Focus on intent, key details, and action items
- Maximum 8 bullet points

EMAIL CONTENT:
${text}
`;


    const response = await axios.post(flaskUrl, {
      prompt: aiPrompt,
    });
    const cleanedText = response.data.text.replace(/^\*\s+/gm, "• ");


    return res.status(200).json({
      success: true,
      summary: response.data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to summarize email",
    });
  }
};

module.exports.generateReplyWithAI = async (req, res) => {
  try {
    const { prompt, email } = req.body;

    if (!prompt || !email) {
      return res.status(400).json({
        success: false,
        message: "Prompt and email context are required"
      });
    }

    const attachmentInfo = (email.attachments || [])
      .map(a => `- ${a.filename}`)
      .join("\n");

    const aiPrompt = `
You are an email assistant helping draft professional replies.

TASK:
Generate a reply email based on the original email and the user instruction.

RULES:
- Do not repeat the original email
- Do not include a subject line
- Keep tone professional and context-aware
- Respond naturally as a human would
- Respect the user's instruction exactly

ORIGINAL EMAIL SUBJECT:
${email.subject}

ORIGINAL EMAIL CONTENT:
${email.message}

ATTACHMENTS:
${attachmentInfo || "None"}

USER INSTRUCTION:
${prompt}
`;
console.log("EMAIL RECEIVED:", req.body.email);

    const response = await axios.post(
      process.env.GEMINI_FLASK_LITE_URL,
      { prompt: aiPrompt }
    );

    return res.status(200).json({
      success: true,
      text: response.data.text
    });

  } catch (err) {
    console.error("AI REPLY ERROR", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate reply"
    });
  }
};
