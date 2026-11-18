const express = require("express");
const requestLogger = require("./middleware/requestLogger");
const tasksRouter = require("./routes/tasks");
const reportsRouter = require("./routes/reports");

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    name: "TaskFlow API",
    message: "Task and project management REST API",
    endpoints: ["/tasks", "/tasks/search", "/reports/summary"]
  });
});

app.use("/tasks", tasksRouter);
app.use("/reports", reportsRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint bulunamadı",
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Geçersiz JSON formatı" });
  }
  return res.status(500).json({ error: "Beklenmeyen sunucu hatası" });
});

module.exports = app;
