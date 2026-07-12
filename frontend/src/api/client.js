const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

export async function generateProject(prompt) {
  const res = await fetch(`${API_URL}/projects/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return handle(res);
}

export async function listProjects() {
  const res = await fetch(`${API_URL}/projects`);
  return handle(res);
}

export async function getProject(id) {
  const res = await fetch(`${API_URL}/projects/${id}`);
  return handle(res);
}
