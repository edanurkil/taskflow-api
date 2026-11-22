const express = require("express");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const tasksRouter = require("./routes/tasks");
const reportsRouter = require("./routes/reports");
const projectsRouter = require("./routes/projects");
const employeesRouter = require("./routes/employees");

const app = express();

app.use(requestLogger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "TaskFlow API",
    message: "Görev ve Proje Yönetim Sistemi REST API",
    endpoints: [
      "/tasks",
      "/tasks/search?keyword=",
      "/tasks/assignee/:assignee",
      "/projects",
      "/projects/:id/tasks",
      "/employees",
      "/employees/:id/tasks",
      "/reports/completed",
      "/reports/pending",
      "/reports/summary"
    ]
  });
});

app.use("/tasks", tasksRouter);
app.use("/projects", projectsRouter);
app.use("/employees", employeesRouter);
app.use("/reports", reportsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
