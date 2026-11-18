const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "..", "..", "logs");
const logFile = path.join(logDirectory, "requests.log");

function requestLogger(req, res, next) {
  const logEntry = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
  console.log(logEntry.trim());

  fs.mkdirSync(logDirectory, { recursive: true });
  fs.appendFile(logFile, logEntry, (error) => {
    if (error) console.error("Log dosyasına yazılamadı:", error.message);
  });

  next();
}

module.exports = requestLogger;
