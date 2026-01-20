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
