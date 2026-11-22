const taskStore = require("../models/taskStore");
const { sortItems, paginate } = require("../utils/query");

const notFound = (res) => res.status(404).json({ error: "Görev bulunamadı" });
const sameText = (a, b) => String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase();

function applyFilters(tasks, query) {
  let result = tasks;
  if (query.status) result = result.filter((task) => task.status === query.status);
  if (query.priority) result = result.filter((task) => task.priority === query.priority);
  if (query.assignee) result = result.filter((task) => sameText(task.assignee, query.assignee));
  if (query.projectId) result = result.filter((task) => task.projectId === String(query.projectId));
  return result;
}

function respondWithList(res, tasks, query) {
  res.json(paginate(sortItems(tasks, query.sort), query));
}

function listTasks(req, res) {
  respondWithList(res, applyFilters(taskStore.readAll(), req.query), req.query);
}

function searchTasks(req, res) {
  const keyword = String(req.query.keyword || "").trim().toLowerCase();
  if (!keyword) return res.status(400).json({ error: "keyword zorunlu bir parametredir" });

  const matches = applyFilters(taskStore.readAll(), req.query).filter((task) =>
    [task.title, task.description, task.assignee]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  );
  respondWithList(res, matches, req.query);
}

function listTasksByAssignee(req, res) {
  const tasks = taskStore.readAll().filter((task) => sameText(task.assignee, req.params.assignee));
  respondWithList(res, applyFilters(tasks, req.query), req.query);
}

function getTask(req, res) {
  const task = taskStore.readAll().find((item) => item.id === req.params.id);
  if (!task) return notFound(res);
  res.json(task);
}

function createTask(req, res) {
  const tasks = taskStore.readAll();
  const { title, description, priority, status, assignee, projectId } = req.body;
  const now = new Date().toISOString();
  const task = {
    id: taskStore.getNextId(tasks),
    title: title.trim(),
    description: description.trim(),
    priority,
    status: status || "pending",
    assignee: assignee.trim(),
    projectId: projectId === undefined || projectId === null ? null : String(projectId),
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  taskStore.writeAll(tasks);
  res.status(201).json(task);
}

function updateTask(req, res) {
  const tasks = taskStore.readAll();
  const index = tasks.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  const { title, description, priority, status, assignee, projectId } = req.body;
  tasks[index] = {
    ...tasks[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(priority !== undefined && { priority }),
    ...(status !== undefined && { status }),
    ...(assignee !== undefined && { assignee: assignee.trim() }),
    ...(projectId !== undefined && { projectId: projectId === null ? null : String(projectId) }),
    updatedAt: new Date().toISOString()
  };

  taskStore.writeAll(tasks);
  res.json(tasks[index]);
}

function deleteTask(req, res) {
  const tasks = taskStore.readAll();
  const index = tasks.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  const [deleted] = tasks.splice(index, 1);
  taskStore.writeAll(tasks);
  res.json({ message: "Görev silindi", task: deleted });
}

module.exports = {
  listTasks,
  searchTasks,
  listTasksByAssignee,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
