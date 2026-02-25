import { getCaseById } from "../db/storage";
import { generateStrategy } from "../logic/strategyEngine";

export default function Strategy({ nav }) {
  const c = nav.activeCaseId ? getCaseById(nav.activeCaseId) : null;

  if (!c) {
    return (
      <div style={{ marginTop: 20 }}>
        <h2>Strategy</h2>
        <p>No active case. Create a new negotiation first.</p>
        <button onClick={() => nav.setPage("intake")}>New Case</button>
      </div>
    );
  }

  const s = generateStrategy(c);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Strategy: {c.title}</h2>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>

        {/* Anchor */}
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Recommended Opening Offer (Anchor)</h3>
          <p style={{ fontSize: 22, margin: 0 }}>
            <b>{s.anchor}</b>
          </p>
          <p style={{ opacity: 0.8, marginTop: 8 }}>
            Precise anchors can strongly influence final outcomes.
          </p>
        </div>

        {/* Concession Plan */}
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Concession Plan</h3>
          <ol>
            {s.concessionPlan.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ol>
          <p style={{ opacity: 0.8 }}>
            Near walk-away option (only if absolutely necessary): <b>{s.nearRP}</b>
          </p>
        </div>

        {/* Tactics */}
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Tactics (based on opponent style)</h3>
          <p>{s.tips}</p>
        </div>

        {/* Scripts */}
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Scripts you can use</h3>
          <ul>
            {(s.scripts || []).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {s.warnings && s.warnings.length > 0 && (
          <div style={{ padding: 12, background: "#fff3cd", borderRadius: 10 }}>
            <h3>Warnings</h3>
            <ul>
              {s.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => nav.setPage("sim")}>
            Start Simulation
          </button>
          <button onClick={() => nav.setPage("intake")}>
            New Case
          </button>
        </div>

      </div>
    </div>
  );
}