const employeeStore = require("../models/employeeStore");
const taskStore = require("../models/taskStore");
const { sortItems, paginate } = require("../utils/query");

const notFound = (res) => res.status(404).json({ error: "Çalışan bulunamadı" });
const lower = (value) => String(value ?? "").trim().toLowerCase();

function findDuplicate(employees, { username, email }, ignoreId) {
  return employees.find(
    (employee) =>
      employee.id !== ignoreId &&
      ((username !== undefined && lower(employee.username) === lower(username)) ||
        (email !== undefined && lower(employee.email) === lower(email)))
  );
}

function listEmployees(req, res) {
  res.json(paginate(sortItems(employeeStore.readAll(), req.query.sort), req.query));
}

function getEmployee(req, res) {
  const employee = employeeStore.readAll().find((item) => item.id === req.params.id);
  if (!employee) return notFound(res);
  res.json(employee);
}

function listEmployeeTasks(req, res) {
  const employee = employeeStore.readAll().find((item) => item.id === req.params.id);
  if (!employee) return notFound(res);

  const tasks = taskStore.readAll().filter((task) => lower(task.assignee) === lower(employee.username));
  res.json(paginate(sortItems(tasks, req.query.sort), req.query));
}

function readAndCheck(req, res) {
  const employees = employeeStore.readAll();
  if (findDuplicate(employees, req.body)) {
    res.status(409).json({ error: "Bu username veya e-posta adresi başka bir çalışan tarafından kullanılıyor" });
    return null;
  }
  return employees;
}

function createEmployee(req, res) {
  const employees = readAndCheck(req, res);
  if (!employees) return;

  const now = new Date().toISOString();
  const { username, name, email, role } = req.body;
  const employee = {
    id: employeeStore.getNextId(employees),
    username: username.trim(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role ? role.trim() : "",
    createdAt: now,
    updatedAt: now
  };

  employees.push(employee);
  employeeStore.writeAll(employees);
  res.status(201).json(employee);
}

function updateEmployee(req, res) {
  const employees = employeeStore.readAll();
  const index = employees.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  if (findDuplicate(employees, req.body, employees[index].id)) {
    return res
      .status(409)
      .json({ error: "Bu username veya e-posta adresi başka bir çalışan tarafından kullanılıyor" });
  }

  const { username, name, email, role } = req.body;
  employees[index] = {
    ...employees[index],
    ...(username !== undefined && { username: username.trim() }),
    ...(name !== undefined && { name: name.trim() }),
    ...(email !== undefined && { email: email.trim().toLowerCase() }),
    ...(role !== undefined && { role: role.trim() }),
    updatedAt: new Date().toISOString()
  };

  employeeStore.writeAll(employees);
  res.json(employees[index]);
}

function deleteEmployee(req, res) {
  const employees = employeeStore.readAll();
  const index = employees.findIndex((item) => item.id === req.params.id);
  if (index === -1) return notFound(res);

  const assigned = taskStore
    .readAll()
    .filter((task) => lower(task.assignee) === lower(employees[index].username));
  if (assigned.length > 0) {
    return res.status(409).json({
      error: "Çalışana atanmış görevler olduğu için silinemez",
      assignedTaskCount: assigned.length
    });
  }

  const [deleted] = employees.splice(index, 1);
  employeeStore.writeAll(employees);
  res.json({ message: "Çalışan silindi", employee: deleted });
}

module.exports = { listEmployees, getEmployee, listEmployeeTasks, createEmployee, updateEmployee, deleteEmployee };
