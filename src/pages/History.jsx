import { getCases, getRunsByCaseId } from "../db/storage";

export default function History({ nav }) {
  const cases = getCases();

  return (
    <div style={{ marginTop: 20 }}>
      <h2>History</h2>

      {cases.length === 0 ? (
        <p>No saved cases yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {cases.map((c) => {
            const runs = getRunsByCaseId(c.id);
            return (
              <div key={c.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
                <h3 style={{ marginTop: 0 }}>{c.title}</h3>
                <div style={{ opacity: 0.85 }}>
                  Role: {c.role} | TP: {c.target} | RP: {c.reservation} | Runs: {runs.length}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      nav.setActiveCaseId(c.id);
                      nav.setPage("strategy");
                    }}
                  >
                    View Strategy
                  </button>

                  <button
                    onClick={() => {
                      nav.setActiveCaseId(c.id);
                      nav.setPage("sim");
                    }}
                  >
                    New Simulation
                  </button>

                  {runs[0] && (
                    <button
                      onClick={() => {
                        nav.setActiveRunId(runs[0].id);
                        nav.setPage("debrief");
                      }}
                    >
                      View Latest Debrief
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}