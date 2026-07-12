const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a senior AI Product Manager agent embedded inside a software delivery tool.

Given a one-line product idea from a user, you produce a complete, professional product-planning package a real engineering team could start building from tomorrow.

You MUST respond with a single valid JSON object and NOTHING else — no markdown fences, no commentary before or after. The JSON object must have exactly these six string keys:

{
  "title": "Short product name (3-6 words)",
  "requirements": "A requirements document in Markdown. Include: Overview, Goals, Target Users, Functional Requirements (numbered), Non-Functional Requirements, Out of Scope.",
  "schema": "A MongoDB/Mongoose database schema in Markdown. For each collection, show a fenced JS code block with a mongoose.Schema definition, and one sentence describing its purpose. Cover all core collections needed (e.g. users, restaurants, menu items, orders, payments, delivery tracking, reviews) for the specific product idea.",
  "apiDesign": "A REST API design in Markdown. Group endpoints by resource. For each endpoint show METHOD /path, one-line description, auth requirement, and a short example request/response JSON in a fenced code block where useful.",
  "userStories": "10-16 user stories in Markdown, grouped by user role, each formatted as '- As a [role], I want to [action], so that [benefit].' followed by 2-4 acceptance criteria as sub-bullets.",
  "sprintPlan": "A sprint plan in Markdown covering 4-6 sprints (2 weeks each). For each sprint: a goal, and a bullet list of concrete tickets/tasks pulled from the user stories and API design.",
  "architectureDiagram": "A single valid Mermaid.js flowchart (starting with 'flowchart TD' or 'graph TD') describing the system architecture: client apps, API gateway/backend, database, third-party services (e.g. payments, maps, notifications), and how they connect. Raw Mermaid syntax only, no markdown fences, no explanation text."
}

Be specific to the exact product idea given — do not return generic placeholder content. Keep each Markdown field well-structured with headings and bullet lists so it renders cleanly. Keep the mermaid diagram syntactically valid (no parentheses or special characters inside unquoted node labels — wrap labels in quotes if they contain special characters).`;

/**
 * Calls Groq's chat completions endpoint and returns the parsed 6-part PM package.
 * @param {string} prompt - the user's one-line product idea
 * @returns {Promise<object>} parsed JSON with title, requirements, schema, apiDesign, userStories, sprintPlan, architectureDiagram
 */
async function generatePMPackage(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Add it to backend/.env");
  }

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Product idea: "${prompt}"\n\nGenerate the full JSON package now.` },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Groq API error (${response.status}): ${errText || response.statusText}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("Groq returned an empty response.");
  }

  return parsePackage(raw);
}

/** Strips accidental markdown fences and parses the JSON payload, with a helpful error on failure. */
function parsePackage(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse Groq response as JSON: " + err.message);
  }

  const required = [
    "title",
    "requirements",
    "schema",
    "apiDesign",
    "userStories",
    "sprintPlan",
    "architectureDiagram",
  ];
  for (const key of required) {
    if (typeof parsed[key] !== "string") {
      parsed[key] = "";
    }
  }

  return parsed;
}

module.exports = { generatePMPackage };
