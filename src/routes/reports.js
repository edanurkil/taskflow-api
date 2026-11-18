const express = require("express");
const { readTasks } = require("../models/taskStore");

const router = express.Router();

router.get("/completed", (req, res) => {
  const tasks = readTasks();
  const count = tasks.filter((task) => task.status === "completed").length;
  res.json({ status: "completed", count });
});

router.get("/pending", (req, res) => {
  const tasks = readTasks();
  const count = tasks.filter((task) => task.status === "pending").length;
  res.json({ status: "pending", count });
});

router.get("/summary", (req, res) => {
  const tasks = readTasks();
  const summary = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    highPriority: tasks.filter((task) => task.priority === "high").length
  };
  res.json(summary);
});

module.exports = router;
