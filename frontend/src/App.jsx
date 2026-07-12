import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import OutputPanel from "./components/OutputPanel";
import History from "./components/History";
import { generateProject, listProjects, getProject } from "./api/client";

export default function App() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    refreshHistory();
  }, []);

  async function refreshHistory() {
    try {
      const items = await listProjects();
      setHistory(items.slice(0, 8));
    } catch {
      // history is a nice-to-have; ignore silently if backend/db isn't up yet
    }
  }

  async function handleGenerate(prompt) {
    setLoading(true);
    setError(null);
    setProject(null);
    try {
      const result = await generateProject(prompt);
      setProject(result);
      refreshHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectHistory(id) {
    setError(null);
    try {
      const result = await getProject(id);
      setProject(result);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="logo">
          Spec<span>/</span>Agent
        </div>
        <div className="topbar-meta">
          MERN · Groq API
          <br />
          v1.0
        </div>
      </div>

      <Hero onGenerate={handleGenerate} loading={loading} />

      {history.length > 0 && !project && (
        <History items={history} onSelect={handleSelectHistory} />
      )}

      {error && <div className="error-banner">{error}</div>}

      <OutputPanel project={project} />

      <footer className="foot">Spec/Agent — drafted by Groq, structured by an Express + MongoDB backend.</footer>
    </div>
  );
}
