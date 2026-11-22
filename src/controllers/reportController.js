const taskStore = require("../models/taskStore");
const projectStore = require("../models/projectStore");
const employeeStore = require("../models/employeeStore");
const { STATUSES, PRIORITIES } = require("../config/constants");

function countBy(items, field, keys) {
  const result = Object.fromEntries(keys.map((key) => [key, 0]));
  items.forEach((item) => {
    if (result[item[field]] !== undefined) result[item[field]] += 1;
  });
  return result;
}

function completedCount(req, res) {
  const count = taskStore.readAll().filter((task) => task.status === "completed").length;
  res.json({ status: "completed", count });
}

function pendingCount(req, res) {
  const count = taskStore.readAll().filter((task) => task.status === "pending").length;
  res.json({ status: "pending", count });
}

function summary(req, res) {
  const tasks = taskStore.readAll();
  const byStatus = countBy(tasks, "status", STATUSES);
  const byPriority = countBy(tasks, "priority", PRIORITIES);
  const tasksByAssignee = {};

  tasks.forEach((task) => {
    const key = String(task.assignee || "atanmamış").toLowerCase();
    tasksByAssignee[key] = (tasksByAssignee[key] || 0) + 1;
  });

  res.json({
    totalTasks: tasks.length,
    byStatus,
    byPriority,
    completionRate: tasks.length ? Math.round((byStatus.completed / tasks.length) * 100) : 0,
    tasksByAssignee,
    totalProjects: projectStore.readAll().length,
    totalEmployees: employeeStore.readAll().length
  });
}

module.exports = { completedCount, pendingCount, summary };
