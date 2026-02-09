const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");
const { generateEmailWithAI,summarizeEmailWithAI,generateReplyWithAI} = require("../controllers/ai.controller");

// POST /api/ai/generate
router.post("/generate", isAuthenticated, generateEmailWithAI);
router.post("/summarize", isAuthenticated, summarizeEmailWithAI); 
router.post("/reply", isAuthenticated, generateReplyWithAI); 
module.exports = router;
