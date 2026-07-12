const Project = require("../models/Project");
const { generatePMPackage } = require("../services/groqService");

// POST /api/projects/generate
async function generateProject(req, res) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "A non-empty 'prompt' string is required." });
  }

  let project = await Project.create({ prompt: prompt.trim(), status: "generating" });

  try {
    const result = await generatePMPackage(prompt.trim());

    project.title = result.title || "Untitled Product";
    project.status = "completed";
    project.model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    project.output = {
      requirements: result.requirements,
      schema: result.schema,
      apiDesign: result.apiDesign,
      userStories: result.userStories,
      sprintPlan: result.sprintPlan,
      architectureDiagram: result.architectureDiagram,
    };
    await project.save();

    return res.status(201).json(project);
  } catch (err) {
    project.status = "failed";
    project.error = err.message;
    await project.save();

    return res.status(502).json({ message: "Generation failed", error: err.message, project });
  }
}

// GET /api/projects
async function listProjects(req, res) {
  const projects = await Project.find().sort({ createdAt: -1 }).select("prompt title status createdAt");
  res.json(projects);
}

// GET /api/projects/:id
async function getProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
}

// DELETE /api/projects/:id
async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Deleted" });
}

module.exports = { generateProject, listProjects, getProject, deleteProject };
