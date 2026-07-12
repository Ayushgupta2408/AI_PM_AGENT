import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  themeVariables: {
    primaryColor: "#e9ebe4",
    primaryTextColor: "#1a2129",
    primaryBorderColor: "#2f6f6a",
    lineColor: "#66707a",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: "13px",
  },
});

let renderCount = 0;

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!code || !code.trim()) return;

    const id = `mermaid-diagram-${renderCount++}`;

    mermaid
      .render(id, code.trim())
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not render diagram");
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!code || !code.trim()) {
    return <p className="empty-state">No diagram generated.</p>;
  }

  if (error) {
    return (
      <div>
        <p className="empty-state">Diagram failed to render: {error}</p>
        <pre>{code}</pre>
      </div>
    );
  }

  return (
    <div className="diagram-box">
      <div ref={containerRef} />
    </div>
  );
}
