const express = require("express");
const cors = require("cors");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(passwordRoutes);

app.use((err, req, res, next) => {
  console.error("[api-error]", err);
  res.status(500).json({
    message: "Erro interno no servidor.",
  });
});

module.exports = app;
