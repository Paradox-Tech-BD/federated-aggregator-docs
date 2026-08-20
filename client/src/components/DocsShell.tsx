/**
 * Research Ledger design: persistent index rail, editorial reading column,
 * and precise evidence/status treatment for a federated-aggregator record.
 */
import { BookOpen, Braces, Network, ScrollText, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { href: "/", label: "Product brief", index: "01", icon: BookOpen },
  { href: "/architecture", label: "Architecture", index: "04", icon: Network },
  { href: "/api", label: "API reference", index: "05", icon: Braces },
  { href: "/research-log", label: "Research log", index: "12", icon: ScrollText },
];

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="ledger-shell">
      <aside className="ledger-sidebar" aria-label="Documentation index">
        <Link href="/" className="brand-lockup" aria-label="Aggregator Ledger documentation home">
          <img src="/manus-storage/aggregator-ledger-mark_6f127630.png" alt="Aggregator Ledger mark" className="brand-mark" />
          <span>
            <strong>AGGREGATOR</strong>
            <em>LEDGER</em>
          </span>
        </Link>

        <div className="sidebar-section-label">CORE PRODUCT</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${active ? "active" : ""}`}>
                <span className="chapter-number">{item.index}</span>
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-section-label narrow">PROTOCOL</div>
        <div className="sidebar-static-list">
          <span>03.1 FedAvg baseline</span>
          <span>03.2 FedProx client term</span>
          <span>08.1 Validation policy</span>
          <span>09.3 Release approval</span>
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
