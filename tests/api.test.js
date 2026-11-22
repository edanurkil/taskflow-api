const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "taskflow-test-"));
const previousEnvironment = {
  DATA_DIR: process.env.DATA_DIR,
  LOG_DIR: process.env.LOG_DIR,
  LOG_CONSOLE: process.env.LOG_CONSOLE
};
process.env.DATA_DIR = path.join(temporaryDirectory, "data");
process.env.LOG_DIR = path.join(temporaryDirectory, "logs");
process.env.LOG_CONSOLE = "false";

const app = require("../src/app");
let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.beforeEach(() => {
  fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true });
  fs.rmSync(process.env.LOG_DIR, { recursive: true, force: true });
  fs.mkdirSync(process.env.DATA_DIR, { recursive: true });
  fs.mkdirSync(process.env.LOG_DIR, { recursive: true });
  for (const name of ["tasks", "projects", "employees"]) {
    fs.writeFileSync(path.join(process.env.DATA_DIR, `${name}.json`), "[]", "utf8");
  }
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });

  for (const [key, value] of Object.entries(previousEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

async function api(method, url, body, rawBody) {
  const options = { method, headers: {} };
  if (rawBody !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = rawBody;
  } else if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${url}`, options);
  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }
  return { status: response.status, body: responseBody };
}

const validTask = {
  title: "Test görevi",
  description: "Test açıklaması",
  priority: "high",
  assignee: "eda"
};

test("root endpoint and unknown endpoint", async () => {
  const root = await api("GET", "/");
  assert.equal(root.status, 200);
  assert.equal(root.body.name, "TaskFlow API");
  assert.ok(root.body.endpoints.includes("/projects/:id/tasks"));

  const unknown = await api("GET", "/yok");
  assert.equal(unknown.status, 404);
  assert.equal(unknown.body.path, "/yok");
});

test("Task CRUD flow and protected fields", async () => {
  const created = await api("POST", "/tasks", validTask);
  assert.equal(created.status, 201);
  assert.equal(created.body.status, "pending");
  assert.equal(created.body.projectId, null);
  assert.ok(created.body.createdAt && created.body.updatedAt);
  const { id } = created.body;

  const list = await api("GET", "/tasks");
  assert.equal(list.status, 200);
  assert.equal(list.body.pagination.total, 1);
  assert.ok(Array.isArray(list.body.data));

  const detail = await api("GET", `/tasks/${id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.title, validTask.title);

  const updated = await api("PUT", `/tasks/${id}`, {
    status: "completed",
    priority: "medium",
    id: "99",
    createdAt: "2000-01-01",
    unexpected: "ignored"
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.status, "completed");
  assert.equal(updated.body.priority, "medium");
  assert.equal(updated.body.id, id);
  assert.equal(updated.body.createdAt, created.body.createdAt);
  assert.equal(updated.body.unexpected, undefined);
  assert.notEqual(updated.body.updatedAt, created.body.updatedAt);

  const deleted = await api("DELETE", `/tasks/${id}`);
  assert.equal(deleted.status, 200);
  assert.equal((await api("GET", `/tasks/${id}`)).status, 404);
  assert.equal((await api("DELETE", `/tasks/${id}`)).status, 404);
});

test("Task validation, malformed JSON and missing records", async () => {
  const missingFields = await api("POST", "/tasks", { title: "eksik" });
  assert.equal(missingFields.status, 400);
  assert.ok(missingFields.body.details.length >= 3);

  assert.equal((await api("POST", "/tasks", { ...validTask, priority: "urgent" })).status, 400);
  assert.equal((await api("POST", "/tasks", { ...validTask, status: "done" })).status, 400);
  assert.equal((await api("POST", "/tasks", { ...validTask, title: "  " })).status, 400);
  assert.equal((await api("POST", "/tasks", { ...validTask, title: "x".repeat(121) })).status, 400);
  assert.equal((await api("POST", "/tasks", { ...validTask, projectId: "999" })).status, 400);
  assert.equal((await api("PUT", "/tasks/1", {})).status, 400);
  assert.equal((await api("PUT", "/tasks/12345", { status: "completed" })).status, 404);

  const badJson = await api("POST", "/tasks", undefined, "{bozuk");
  assert.equal(badJson.status, 400);
  assert.equal(badJson.body.error, "Geçersiz JSON formatı");
});

test("filtering, search, sorting and pagination", async () => {
  await api("POST", "/tasks", { ...validTask, title: "Backend kur", priority: "low", assignee: "eda" });
  await api("POST", "/tasks", { ...validTask, title: "Test yaz", priority: "high", status: "completed" });
  await api("POST", "/tasks", { ...validTask, title: "Dokümantasyon", priority: "medium", status: "in_progress" });

  const completed = await api("GET", "/tasks?status=completed");
  assert.ok(completed.body.data.length >= 1);
  assert.ok(completed.body.data.every((task) => task.status === "completed"));

  const lowPriority = await api("GET", "/tasks?priority=low");
  assert.ok(lowPriority.body.data.every((task) => task.priority === "low"));

  const search = await api("GET", "/tasks/search?keyword=BACKEND");
  assert.equal(search.status, 200);
  assert.ok(search.body.data.some((task) => task.title === "Backend kur"));
  assert.equal((await api("GET", "/tasks/search")).status, 400);

  const assignee = await api("GET", "/tasks/assignee/EDA");
  assert.ok(assignee.body.data.length >= 1);
  assert.ok(assignee.body.data.every((task) => task.assignee.toLowerCase() === "eda"));

  assert.equal((await api("GET", "/tasks?sort=-priority")).body.data[0].priority, "high");
  assert.equal((await api("GET", "/tasks?sort=priority")).body.data[0].priority, "low");

  const page = await api("GET", "/tasks?page=1&limit=2");
  assert.equal(page.body.data.length, 2);
  assert.equal(page.body.pagination.limit, 2);
  assert.ok(page.body.pagination.totalPages >= 2);

  assert.equal((await api("GET", "/tasks?status=invalid")).status, 400);
  assert.equal((await api("GET", "/tasks?sort=invalid")).status, 400);
  assert.equal((await api("GET", "/tasks?limit=1000")).status, 400);
  assert.equal((await api("GET", "/tasks?page=0")).status, 400);
});

test("Project and Employee CRUD and task relationships", async () => {
  const employee = await api("POST", "/employees", {
    username: "deniz",
    name: "Deniz Yıldız",
    email: "DENIZ@taskflow.dev",
    role: "QA"
  });
  assert.equal(employee.status, 201);
  assert.equal(employee.body.email, "deniz@taskflow.dev");
  assert.equal((await api("POST", "/employees", {
    username: "DENIZ",
    name: "Başka",
    email: "other@taskflow.dev"
  })).status, 409);
  assert.equal((await api("POST", "/employees", {
    username: "x1",
    name: "X",
    email: "gecersiz"
  })).status, 400);

  const employeeUpdate = await api("PUT", `/employees/${employee.body.id}`, { role: "Senior QA" });
  assert.equal(employeeUpdate.body.role, "Senior QA");

  const project = await api("POST", "/projects", { name: "Mobil Uygulama", description: "Test projesi" });
  assert.equal(project.status, 201);
  assert.equal((await api("POST", "/projects", { description: "İsimsiz" })).status, 400);
  assert.equal((await api("PUT", `/projects/${project.body.id}`, { name: "Mobil v2" })).body.name, "Mobil v2");

  const task = await api("POST", "/tasks", {
    ...validTask,
    assignee: employee.body.username,
    projectId: project.body.id
  });
  assert.equal(task.status, 201);
  assert.equal(task.body.projectId, project.body.id);
  assert.equal((await api("GET", `/projects/${project.body.id}/tasks`)).body.pagination.total, 1);
  assert.equal((await api("GET", `/employees/${employee.body.id}/tasks`)).body.pagination.total, 1);
  assert.equal((await api("DELETE", `/projects/${project.body.id}`)).status, 409);
  assert.equal((await api("DELETE", `/employees/${employee.body.id}`)).status, 409);

  const unlinked = await api("PUT", `/tasks/${task.body.id}`, { projectId: null });
  assert.equal(unlinked.body.projectId, null);
  assert.equal((await api("GET", `/projects/${project.body.id}/tasks`)).body.pagination.total, 0);

  await api("DELETE", `/tasks/${task.body.id}`);
  assert.equal((await api("DELETE", `/projects/${project.body.id}`)).status, 200);
  assert.equal((await api("DELETE", `/employees/${employee.body.id}`)).status, 200);
  assert.equal((await api("GET", `/projects/${project.body.id}`)).status, 404);
  assert.equal((await api("GET", `/employees/${employee.body.id}`)).status, 404);
});

test("report endpoints return consistent totals", async () => {
  await api("POST", "/tasks", { ...validTask, status: "completed" });
  await api("POST", "/tasks", { ...validTask, status: "in_progress", priority: "low" });

  const completed = await api("GET", "/reports/completed");
  const pending = await api("GET", "/reports/pending");
  const summary = await api("GET", "/reports/summary");
  assert.equal(completed.body.count, 1);
  assert.equal(pending.body.count, 0);
  assert.equal(summary.body.totalTasks, 2);
  assert.equal(
    summary.body.byStatus.pending + summary.body.byStatus.in_progress + summary.body.byStatus.completed,
    summary.body.totalTasks
  );
  assert.equal(summary.body.completionRate, 50);
  assert.equal(summary.body.totalEmployees, 0);
});

test("logger records successful and invalid JSON requests with status and duration", async () => {
  await api("GET", "/tasks?page=1&limit=5");
  await api("POST", "/tasks", undefined, "{bozuk");

  const log = fs.readFileSync(path.join(process.env.LOG_DIR, "requests.log"), "utf8");
  assert.match(log, /^\d{4}-\d{2}-\d{2}T[\d:.]+Z GET \/tasks\?page=1&limit=5 200 [\d.]+ms/m);
  assert.match(log, /POST \/tasks 400 [\d.]+ms/);
});

test("project and employee list queries validate pagination", async () => {
  assert.equal((await api("GET", "/projects?page=0")).status, 400);
  assert.equal((await api("GET", "/employees?limit=abc")).status, 400);
});
