/**
 * Research Ledger design: persistent index rail, editorial reading column,
 * and precise evidence/status treatment for a federated-aggregator record.
 */
import { BookOpen, Braces, ClipboardList, Menu, Network, ShieldCheck, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Product brief", index: "01", icon: BookOpen },
  { href: "/requirements", label: "Integrated requirements", index: "02", icon: ClipboardList },
  { href: "/technical-requirements", label: "System specification", index: "03", icon: Braces },
  { href: "/architecture", label: "Architecture", index: "04", icon: Network },
  { href: "/api", label: "API reference", index: "05", icon: Braces },
];

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ledger-shell">
      <aside className={`ledger-sidebar ${isOpen ? "mobile-open" : ""}`} aria-label="Documentation index">
        <Link href="/" className="brand-lockup" aria-label="Aggregator Ledger documentation home">
          <span className="brand-glyph" aria-hidden="true"><i /><b /><em /></span>
          <span>
            <strong>AGGREGATOR</strong>
            <em>LEDGER</em>
          </span>
        </Link>
        <button className="mobile-nav-toggle" type="button" aria-label={isOpen ? "Close documentation navigation" : "Open documentation navigation"} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="sidebar-section-label">DOCUMENT INDEX</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`sidebar-link ${active ? "active" : ""}`}>
                <span className="chapter-number">{item.index}</span>
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-runtime" aria-label="Documentation environment">
          <div><span className="runtime-dot" aria-hidden="true" /><span>RESEARCH DOCUMENTATION</span></div>
          <p>Static release · protocol workbench</p>
        </div>

        <div className="sidebar-footnote">
          <ShieldCheck size={15} />
          <span>Documentation mode: no production credentials, raw images, or live model releases.</span>
        </div>
      </aside>
      <main className="ledger-main">{children}</main>
    </div>
  );
}
