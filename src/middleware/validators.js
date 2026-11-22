const { STATUSES, PRIORITIES, SORT_FIELDS } = require("../config/constants");
const projectStore = require("../models/projectStore");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9._-]+$/i;

function fail(res, errors) {
  return res.status(400).json({ error: "Geçersiz veri", details: errors });
}

function checkText(errors, value, name, { required, max }) {
  if (value === undefined) {
    if (required) errors.push(`${name} zorunludur`);
    return;
  }
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${name} boş olmayan bir metin olmalıdır`);
  } else if (value.trim().length > max) {
    errors.push(`${name} en fazla ${max} karakter olabilir`);
  }
}

function checkEnum(errors, value, name, allowed, required) {
  if (value === undefined) {
    if (required) errors.push(`${name} zorunludur`);
    return;
  }
  if (!allowed.includes(value)) {
    errors.push(`${name} şunlardan biri olmalıdır: ${allowed.join(", ")}`);
  }
}

function hasAnyField(body, fields) {
  return fields.some((field) => body[field] !== undefined);
}

function validateTask(req, res, next) {
  const isUpdate = req.method === "PUT";
  const body = req.body || {};
  const errors = [];
  const fields = ["title", "description", "priority", "status", "assignee", "projectId"];

  if (isUpdate && !hasAnyField(body, fields)) {
    return fail(res, ["Güncellenecek en az bir alan gönderilmelidir"]);
  }

  checkText(errors, body.title, "title", { required: !isUpdate, max: 120 });
  checkText(errors, body.description, "description", { required: !isUpdate, max: 1000 });
  checkText(errors, body.assignee, "assignee", { required: !isUpdate, max: 50 });
  checkEnum(errors, body.priority, "priority", PRIORITIES, !isUpdate);
  checkEnum(errors, body.status, "status", STATUSES, false);

  if (body.projectId !== undefined && body.projectId !== null) {
    const id = String(body.projectId);
    if (!projectStore.readAll().some((project) => project.id === id)) {
      errors.push("projectId ile eşleşen bir proje bulunamadı");
    }
  }

  if (errors.length) return fail(res, errors);
  next();
}

function validateProject(req, res, next) {
  const isUpdate = req.method === "PUT";
  const body = req.body || {};
  const errors = [];

  if (isUpdate && !hasAnyField(body, ["name", "description"])) {
    return fail(res, ["Güncellenecek en az bir alan gönderilmelidir"]);
  }

  checkText(errors, body.name, "name", { required: !isUpdate, max: 100 });
  checkText(errors, body.description, "description", { required: false, max: 500 });

  if (errors.length) return fail(res, errors);
  next();
}

function validateEmployee(req, res, next) {
  const isUpdate = req.method === "PUT";
  const body = req.body || {};
  const errors = [];

  if (isUpdate && !hasAnyField(body, ["username", "name", "email", "role"])) {
    return fail(res, ["Güncellenecek en az bir alan gönderilmelidir"]);
  }

  checkText(errors, body.username, "username", { required: !isUpdate, max: 30 });
  if (typeof body.username === "string" && body.username.trim() && !USERNAME_PATTERN.test(body.username.trim())) {
    errors.push("username sadece harf, rakam, nokta, tire ve alt çizgi içerebilir");
  }
  checkText(errors, body.name, "name", { required: !isUpdate, max: 100 });
  checkText(errors, body.email, "email", { required: !isUpdate, max: 100 });
  if (typeof body.email === "string" && body.email.trim() && !EMAIL_PATTERN.test(body.email.trim())) {
    errors.push("email geçerli bir e-posta adresi olmalıdır");
  }
  checkText(errors, body.role, "role", { required: false, max: 50 });

  if (errors.length) return fail(res, errors);
  next();
}

function validateListQuery(req, res, next) {
  const { status, priority, sort, page, limit } = req.query;
  const errors = [];

  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`status şunlardan biri olmalıdır: ${STATUSES.join(", ")}`);
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push(`priority şunlardan biri olmalıdır: ${PRIORITIES.join(", ")}`);
  }
  if (sort !== undefined) {
    const field = String(sort).replace(/^-/, "");
    if (!SORT_FIELDS.includes(field)) {
      errors.push(`sort şunlardan biri olmalıdır: ${SORT_FIELDS.join(", ")} (azalan için başına - koyun)`);
    }
  }
  if (page !== undefined && !(Number.isInteger(Number(page)) && Number(page) >= 1)) {
    errors.push("page 1 veya daha büyük bir tam sayı olmalıdır");
  }
  if (limit !== undefined && !(Number.isInteger(Number(limit)) && Number(limit) >= 1 && Number(limit) <= 100)) {
    errors.push("limit 1 ile 100 arasında bir tam sayı olmalıdır");
  }

  if (errors.length) return fail(res, errors);
  next();
}

module.exports = { validateTask, validateProject, validateEmployee, validateListQuery };
