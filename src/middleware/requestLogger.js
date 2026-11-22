const fs = require("fs");
const path = require("path");

function logFilePath() {
  const directory = process.env.LOG_DIR || path.join(__dirname, "..", "..", "logs");
  return { directory, file: path.join(directory, "requests.log") };
}

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const line = `${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`;

    if (process.env.LOG_CONSOLE !== "false") console.log(line);
    if (process.env.LOG_TO_FILE === "false") return;

    try {
      const { directory, file } = logFilePath();
      fs.mkdirSync(directory, { recursive: true });
      fs.appendFileSync(file, `${line}\n`, "utf8");
    } catch (error) {
      console.error("Log dosyasına yazılamadı:", error.message);
    }
  });

  next();
}

module.exports = requestLogger;
