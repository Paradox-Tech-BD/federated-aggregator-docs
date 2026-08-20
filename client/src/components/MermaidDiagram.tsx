/**
 * Research Ledger design: controlled Mermaid rendering for reviewed, static documentation diagrams.
 */
import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

type MermaidDiagramProps = { chart: string; label: string };

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "base",
  themeVariables: {
    background: "#fffdf8",
    primaryColor: "#e2efed",
    primaryTextColor: "#182c32",
    primaryBorderColor: "#0d7c78",
    lineColor: "#4f7774",
    secondaryColor: "#f1e8d0",
    tertiaryColor: "#f3f0e7",
    fontFamily: "IBM Plex Mono, monospace",
  },
  er: { useMaxWidth: true },
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
});

export function MermaidDiagram({ chart, label }: MermaidDiagramProps) {
  const node = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const generatedId = useId().replace(/:/g, "");

  useEffect(() => {
    let active = true;
    setError(false);
    mermaid.render(`ledger-mermaid-${generatedId}`, chart).then(({ svg }) => {
      if (active && node.current) node.current.innerHTML = svg;
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [chart, generatedId]);

  return <figure className="mermaid-panel"><figcaption>{label}</figcaption>{error ? <p className="mermaid-error">Diagram rendering is unavailable in this browser. The documented schema remains available below.</p> : <div ref={node} className="mermaid-canvas" />}</figure>;
}
