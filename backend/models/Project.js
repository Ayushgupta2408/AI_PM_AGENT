const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "Untitled Product",
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
    error: {
      type: String,
      default: null,
    },
    output: {
      requirements: { type: String, default: "" },
      schema: { type: String, default: "" },
      apiDesign: { type: String, default: "" },
      userStories: { type: String, default: "" },
      sprintPlan: { type: String, default: "" },
      architectureDiagram: { type: String, default: "" },
    },
    model: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
