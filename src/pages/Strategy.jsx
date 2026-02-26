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

      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>

        {/* Anchor */}
        <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Recommended Opening Offer (Anchor)</h3>
          <div style={{ fontSize: 24 }}>
            <b>{s.anchor}</b>
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
            Precise anchors can strongly influence final outcomes.
          </div>
        </div>

        {/* Concession Plan */}
        <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Concession Plan</h3>
          <ol>
            {s.concessionPlan.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ol>
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            Near walk-away option (only if absolutely necessary): <b>{s.nearRP}</b>
          </div>
        </div>

        {/* Tactics */}
        <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Tactics (based on opponent style)</h3>
          <p style={{ margin: 0 }}>{s.tips}</p>
        </div>

        {/* Scripts */}
        <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Scripts you can use</h3>
          <ul>
            {(s.scripts || []).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {s.warnings && s.warnings.length > 0 && (
          <div
            style={{
              padding: 14,
              backgroundColor: "#ffe9e9",
              border: "1px solid #ff4d4f",
              borderRadius: 10,
              color: "#7a0000",
              fontWeight: 500,
              lineHeight: 1.5
            }}
          >
            <h3 style={{ marginTop: 0 }}>⚠️ Warnings</h3>
            <ul style={{ marginBottom: 0 }}>
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