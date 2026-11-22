const express = require("express");
const controller = require("../controllers/employeeController");
const { validateEmployee, validateListQuery } = require("../middleware/validators");

const router = express.Router();

router.get("/", validateListQuery, controller.listEmployees);
router.post("/", validateEmployee, controller.createEmployee);
router.get("/:id/tasks", validateListQuery, controller.listEmployeeTasks);
router.get("/:id", controller.getEmployee);
router.put("/:id", validateEmployee, controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);

module.exports = router;
