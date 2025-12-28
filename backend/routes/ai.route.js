const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");
const { generateEmailWithAI } = require("../controllers/ai.controller");

// POST /api/ai/generate
router.post("/generate", isAuthenticated, generateEmailWithAI);

module.exports = router;
