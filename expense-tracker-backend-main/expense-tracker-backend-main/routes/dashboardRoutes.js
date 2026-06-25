const express = require("express");
const { project } = require("../middleware/authMiddleware");
const { getDashboardData } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", project, getDashboardData);

module.exports = router;