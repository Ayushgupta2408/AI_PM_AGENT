require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", groqConfigured: Boolean(process.env.GROQ_API_KEY) });
});

app.use("/api/projects", projectRoutes);

// Central error handler (catches anything thrown in async route handlers via next(err))
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`AI PM Agent API running on http://localhost:${PORT}`));
});
