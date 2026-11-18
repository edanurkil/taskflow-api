const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "..", "data", "tasks.json");

function readTasks() {
  const content = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(content);
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2), "utf8");
}

function getNextId(tasks) {
  if (tasks.length === 0) return "1";
  const numericIds = tasks.map((task) => Number(task.id)).filter(Number.isFinite);
  return String(Math.max(0, ...numericIds) + 1);
}

module.exports = { readTasks, writeTasks, getNextId };
