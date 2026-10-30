const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "LabLedger backend is running"
    });
});

console.log(
    "LabLedger Gemini API key Loaded:",
    Boolean(process.env.GEMINI_API_KEY) ? "✅" : "❌"
);

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`LabLedger server is running on port ${PORT}`);
});