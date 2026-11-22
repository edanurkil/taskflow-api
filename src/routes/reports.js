const express = require("express");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.get("/completed", reportController.completedCount);
router.get("/pending", reportController.pendingCount);
router.get("/summary", reportController.summary);

module.exports = router;
