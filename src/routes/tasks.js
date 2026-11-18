const express = require("express");
const validateTask = require("../middleware/validateTask");
const { readTasks, writeTasks, getNextId } = require("../models/taskStore");

const router = express.Router();

router.get("/search", (req, res) => {
  const keyword = (req.query.keyword || "").toString().trim().toLowerCase();
  if (!keyword) return res.status(400).json({ error: "keyword zorunlu bir parametre değeridir." });

  const matches = readTasks().filter((task) =>
    [task.title, task.description, task.assignee]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  );
  res.json(matches);
});

router.get("/assignee/:assignee", (req, res) => {
  const assignee = req.params.assignee.toLowerCase();
  const tasks = readTasks().filter((task) => task.assignee.toLowerCase() === assignee);
  res.json(tasks);
});

router.get("/", (req, res) => {
  let tasks = readTasks();
  const { status, priority, sort } = req.query;

  if (status) tasks = tasks.filter((task) => task.status === status);
  if (priority) tasks = tasks.filter((task) => task.priority === priority);

  if (sort === "createdAt") {
    tasks = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === "-createdAt") {
    tasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const start = (page - 1) * limit;

  res.json({
    data: tasks.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: tasks.length,
      totalPages: Math.ceil(tasks.length / limit)
    }
  });
});

router.post("/", validateTask, (req, res) => {
  const tasks = readTasks();
  const task = {
    id: getNextId(tasks),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    priority: req.body.priority,
    status: req.body.status || "pending",
    assignee: req.body.assignee.trim(),
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

router.get("/:id", (req, res) => {
  const task = readTasks().find((item) => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Görev bulunamadı" });
  res.json(task);
});

router.put("/:id", validateTask, (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Görev bulunamadı" });

  tasks[index] = {
    ...tasks[index],
    ...req.body,
    id: tasks[index].id,
    title: req.body.title !== undefined ? req.body.title.trim() : tasks[index].title,
    description: req.body.description !== undefined ? req.body.description.trim() : tasks[index].description,
    assignee: req.body.assignee !== undefined ? req.body.assignee.trim() : tasks[index].assignee
  };
  writeTasks(tasks);
  res.json(tasks[index]);
});

router.delete("/:id", (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Görev bulunamadı" });

  const deleted = tasks.splice(index, 1)[0];
  writeTasks(tasks);
  res.json({ message: "Görev silindi", task: deleted });
});

module.exports = router;
