const express = require("express");
const cors = require("cors");
require("dotenv").config();

const recordRoutes = require("./routes/recordRoutes");

const app = express();

app.use(cors({
    origin: ["*",
        "https://labledger-backend-yg9e.onrender.com"
    ],
}));

app.use(express.json());

app.use("/api", recordRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "LabLedger backend is running"
    });
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            success: false,
            message: "Request body must contain valid JSON."
        });
    }

    console.error("Unhandled server error:", error);
    return res.status(500).json({
        success: false,
        message: "The server encountered an unexpected error."
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