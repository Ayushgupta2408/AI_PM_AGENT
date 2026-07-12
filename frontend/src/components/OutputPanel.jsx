import { useState } from "react";
import ReactMarkdown from "react-markdown";
import MermaidDiagram from "./MermaidDiagram";

const TABS = [
  { key: "requirements", label: "Requirements", num: "01" },
  { key: "schema", label: "DB Schema", num: "02" },
  { key: "apiDesign", label: "API Design", num: "03" },
  { key: "userStories", label: "User Stories", num: "04" },
  { key: "sprintPlan", label: "Sprint Plan", num: "05" },
  { key: "architectureDiagram", label: "Architecture", num: "06" },
];

export default function OutputPanel({ project }) {
  const [active, setActive] = useState("requirements");

  if (!project) return null;

  const { output, status, error, title, model } = project;
  const activeTab = TABS.find((t) => t.key === active);

  return (
    <div className="spec-wrap">
      <div className="spec-heading">
        <h2>{title || "Untitled Product"}</h2>
        {model && <span className="tag">{model}</span>}
      </div>

      {status === "generating" && (
        <div className="loading-row" style={{ marginBottom: 20 }}>
          <span className="loading-dot" />
          Drafting the spec with Groq…
        </div>
      )}

      {status === "failed" && (
        <div className="error-banner" style={{ maxWidth: "none", margin: "0 0 20px" }}>
          Generation failed: {error}
        </div>
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${active === t.key ? "active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            <span className="num">{t.num}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="sheet">
        <span className="stamp">Generated · Groq</span>

        {active === "architectureDiagram" ? (
          <MermaidDiagram code={output?.architectureDiagram} />
        ) : (
          <div className="sheet-content">
            {output?.[active] ? (
              <ReactMarkdown>{output[active]}</ReactMarkdown>
            ) : (
              <p className="empty-state">
                {status === "generating" ? "Waiting on Groq…" : `No ${activeTab.label.toLowerCase()} yet.`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
