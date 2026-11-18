const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const request = require("supertest");
const app = require("../src/app");

const dataFile = path.join(__dirname, "..", "data", "tasks.json");
const originalData = fs.readFileSync(dataFile, "utf8");

test.afterEach(() => {
  fs.writeFileSync(dataFile, originalData, "utf8");
});

test("GET /tasks returns paginated tasks", async () => {
  const response = await request(app).get("/tasks?page=1&limit=10");
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
  assert.equal(response.body.pagination.total, 2);
});

test("POST /tasks creates a task", async () => {
  const response = await request(app).post("/tasks").send({
    title: "Test görevi",
    description: "Supertest ile oluşturuldu",
    priority: "medium",
    status: "pending",
    assignee: "musa"
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.title, "Test görevi");
});

test("POST /tasks rejects invalid data", async () => {
  const response = await request(app).post("/tasks").send({ title: "" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Doğrulama hatası");
});

test("GET /tasks/:id returns and PUT updates a task", async () => {
  const detail = await request(app).get("/tasks/1");
  assert.equal(detail.status, 200);

  const update = await request(app).put("/tasks/1").send({ status: "in_progress" });
  assert.equal(update.status, 200);
  assert.equal(update.body.status, "in_progress");
});

test("DELETE /tasks/:id deletes a task", async () => {
  const response = await request(app).delete("/tasks/1");
  assert.equal(response.status, 200);
  assert.equal(response.body.task.id, "1");
});

test("GET /reports/summary returns system summary", async () => {
  const response = await request(app).get("/reports/summary");
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 2);
});
