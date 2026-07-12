import { useState } from "react";

const EXAMPLES = [
  "Build a food delivery app",
  "Peer-to-peer car rental marketplace",
  "AI-powered habit tracker",
  "B2B invoicing platform for freelancers",
];

export default function Hero({ onGenerate, loading }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onGenerate(value.trim());
  }

  return (
    <section className="hero">
      <div className="hero-eyebrow">Spec/Agent — AI Product Manager</div>
      <h1>
        Turn one line into a<br />
        <em>full product spec.</em>
      </h1>
      <p className="sub">
        Describe a product idea. Get requirements, a database schema, API design,
        user stories, a sprint plan, and an architecture diagram — drafted by Groq
        in seconds.
      </p>

      <form className="terminal" onSubmit={submit}>
        <div className="terminal-bar">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-title">new-product.brief</span>
        </div>
        <div className="terminal-body">
          <div className="prompt-row">
            <span className="prompt-caret">&gt;</span>
            <textarea
              className="prompt-input"
              rows={2}
              placeholder="Build a food delivery app"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) submit(e);
              }}
            />
          </div>
        </div>
        <div className="terminal-footer">
          <div className="chips">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                key={ex}
                className="chip"
                onClick={() => setValue(ex)}
                disabled={loading}
              >
                {ex}
              </button>
            ))}
          </div>
          <button className="generate-btn" type="submit" disabled={loading || !value.trim()}>
            {loading ? "Drafting…" : "Draft the spec →"}
          </button>
        </div>
      </form>
    </section>
  );
}
