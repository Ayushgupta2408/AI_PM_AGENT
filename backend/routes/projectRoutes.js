const express = require("express");
const {
  generateProject,
  listProjects,
  getProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/generate", generateProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);

module.exports = router;
