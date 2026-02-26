import { getCaseById, getRunById } from "../db/storage";
import OfferChart from "../components/OfferChart";
import { scoreRun } from "../logic/scoring";

export default function Debrief({ nav }) {
  const run = nav.activeRunId ? getRunById(nav.activeRunId) : null;
  const c = run ? getCaseById(run.caseId) : null;

  if (!run || !c) {
    return (
      <div style={{ marginTop: 20 }}>
        <h2>Debrief</h2>
        <p>No run selected yet. Complete a simulation first.</p>
        <button onClick={() => nav.setPage("sim")} disabled={!nav.activeCaseId}>
          Go to Simulation
        </button>
      </div>
    );
  }

  const score = scoreRun(c, run);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Debrief: {c.title}</h2>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <b>Outcome:</b> {run.outcome}<br />
          <b>Final price:</b> {run.finalPrice ?? "—"}<br />
          <b>Bot reservation (revealed):</b> {run.botReservation}
        </div>

        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Score</h3>
          <p style={{ fontSize: 22, margin: 0 }}><b>{score.total}</b>/100</p>
          <ul>
            <li>Value capture: {score.valueScore}</li>
            <li>Discipline (RP): {score.discipline}</li>
            <li>Outcome points: {score.outcomePoints}</li>
          </ul>
        </div>

        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Offer History</h3>
          {run.rounds.length === 0 ? (
            <p>No rounds recorded.</p>
          ) : (
            <OfferChart rounds={run.rounds} />
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => nav.setPage("history")}>View History</button>
          <button onClick={() => nav.setPage("strategy")}>Back to Strategy</button>
        </div>
      </div>
    </div>
  );
}