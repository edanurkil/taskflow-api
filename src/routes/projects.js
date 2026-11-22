const express = require("express");
const controller = require("../controllers/projectController");
const { validateProject, validateListQuery } = require("../middleware/validators");

const router = express.Router();

router.get("/", validateListQuery, controller.listProjects);
router.post("/", validateProject, controller.createProject);
router.get("/:id/tasks", validateListQuery, controller.listProjectTasks);
router.get("/:id", controller.getProject);
router.put("/:id", validateProject, controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;
