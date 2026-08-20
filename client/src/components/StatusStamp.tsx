/** Research Ledger design: evidence stamps make uncertainty and operational status impossible to miss. */
export function StatusStamp({ status }: { status: "PROVISIONAL" | "VALIDATED" | "BLOCKED" | "MOCK MODE" }) {
  return <span className={`status-stamp ${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}
