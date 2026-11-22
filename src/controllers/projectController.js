const projectStore = require("../models/projectStore");
const taskStore = require("../models/taskStore");
const { sortItems, paginate } = require("../utils/query");

const notFound = (res) => res.status(404).json({ error: "Proje bulunamadı" });

function listProjects(req, res) {
  res.json(paginate(sortItems(projectStore.readAll(), req.query.sort), req.query));
}

function getProject(req, res) {
  const project = projectStore.readAll().find((item) => item.id === req.params.id);
  if (!project) return notFound(res);
  res.json(project);
}

function listProjectTasks(req, res) {
  const project = projectStore.readAll().find((item) => item.id === req.params.id);
  if (!project) return notFound(res);

  const tasks = taskStore.readAll().filter((task) => task.projectId === project.id);
  res.json(paginate(sortItems(tasks, req.query.sort), req.query));
}

function createProject(req, res) {
  const projects = projectStore.readAll();
  const now = new Date().toISOString();
  const { name, description } = req.body;
  const project = {
    id: projectStore.getNextId(projects),
    name: name.trim(),
    description: description ? description.trim() : "",
    createdAt: now,
    updatedAt: now
  };

  projects.push(project);
  projectStore.writeAll(projects);
  res.status(201).json(project);
}

function updateProject(req, res) {
  const projects = projectStore.readAll();
  const index = projects.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  const { name, description } = req.body;
  projects[index] = {
    ...projects[index],
    ...(name !== undefined && { name: name.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    updatedAt: new Date().toISOString()
  };

  projectStore.writeAll(projects);
  res.json(projects[index]);
}

function deleteProject(req, res) {
  const projects = projectStore.readAll();
  const index = projects.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  const linkedTasks = taskStore.readAll().filter((task) => task.projectId === projects[index].id);
  if (linkedTasks.length > 0) {
    return res.status(409).json({
      error: "Projeye bağlı görevler olduğu için silinemez",
      linkedTaskCount: linkedTasks.length
    });
  }

  const [deleted] = projects.splice(index, 1);
  projectStore.writeAll(projects);
  res.json({ message: "Proje silindi", project: deleted });
}

module.exports = { listProjects, getProject, listProjectTasks, createProject, updateProject, deleteProject };
