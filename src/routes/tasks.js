const express = require("express");
const controller = require("../controllers/taskController");
const { validateTask, validateListQuery } = require("../middleware/validators");

const router = express.Router();

router.get("/search", validateListQuery, controller.searchTasks);
router.get("/assignee/:assignee", validateListQuery, controller.listTasksByAssignee);
router.get("/", validateListQuery, controller.listTasks);
router.post("/", validateTask, controller.createTask);
router.get("/:id", controller.getTask);
router.put("/:id", validateTask, controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
