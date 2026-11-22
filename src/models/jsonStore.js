const fs = require("fs");
const path = require("path");

function createJsonStore(fileName) {
  function getDataFile() {
    const dataDirectory = process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");
    return path.join(dataDirectory, fileName);
  }

  function readAll() {
    const dataFile = getDataFile();
    if (!fs.existsSync(dataFile)) return [];
    const content = fs.readFileSync(dataFile, "utf8");
    return content.trim() ? JSON.parse(content) : [];
  }

  function writeAll(items) {
    const dataFile = getDataFile();
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), "utf8");
  }

  function getNextId(items) {
    if (items.length === 0) return "1";
    const numericIds = items.map((item) => Number(item.id)).filter(Number.isFinite);
    return String(Math.max(0, ...numericIds) + 1);
  }

  return { readAll, writeAll, getNextId };
}

module.exports = createJsonStore;
