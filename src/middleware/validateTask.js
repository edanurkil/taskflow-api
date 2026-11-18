const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["pending", "in_progress", "completed"];

function validateTask(req, res, next) {
  const { title, description, priority, status, assignee } = req.body;
  const errors = [];

  if (req.method === "POST") {
    if (typeof title !== "string" || !title.trim()) errors.push("title zorunlu ve metin olmalıdır.");
    if (typeof description !== "string" || !description.trim()) errors.push("description zorunlu ve metin olmalıdır.");
    if (typeof priority !== "string" || !VALID_PRIORITIES.includes(priority)) {
      errors.push("priority low, medium veya high olmalıdır.");
    }
    if (typeof assignee !== "string" || !assignee.trim()) errors.push("assignee zorunlu ve metin olmalıdır.");
  } else {
    if (title !== undefined && (typeof title !== "string" || !title.trim())) errors.push("title metin olmalıdır.");
    if (description !== undefined && (typeof description !== "string" || !description.trim())) {
      errors.push("description metin olmalıdır.");
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      errors.push("priority low, medium veya high olmalıdır.");
    }
    if (assignee !== undefined && (typeof assignee !== "string" || !assignee.trim())) {
      errors.push("assignee metin olmalıdır.");
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push("status pending, in_progress veya completed olmalıdır.");
  }

  if (Object.keys(req.body).length === 0) errors.push("Güncellenecek en az bir alan gönderilmelidir.");

  if (errors.length > 0) {
    return res.status(400).json({ error: "Doğrulama hatası", details: errors });
  }

  next();
}

module.exports = validateTask;
