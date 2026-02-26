import { useState } from "react";
import Intake from "./pages/Intake";
import Strategy from "./pages/Strategy";
import Sim from "./pages/Sim";
import Debrief from "./pages/Debrief";
import History from "./pages/History";

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [activeRunId, setActiveRunId] = useState(null);

  const nav = { page, setPage, activeCaseId, setActiveCaseId, activeRunId, setActiveRunId };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Negotiation Coach</h1>

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("intake")}>New Case</button>
        <button
          onClick={() => setPage("strategy")}
          disabled={!activeCaseId}
          title={!activeCaseId ? "Create a case first" : "View strategy"}
        >
          Strategy
        </button>
        <button
          onClick={() => setPage("sim")}
          disabled={!activeCaseId}
          title={!activeCaseId ? "Create a case first" : "Start simulation"}
        >
          Simulation
        </button>
        <button
          onClick={() => setPage("debrief")}
          disabled={!activeRunId}
          title={!activeRunId ? "Complete a simulation first" : "View debrief"}
        >
          Debrief
        </button>
        <button onClick={() => setPage("history")}>History</button>
      </div>

      {page === "home" && (
        <div style={{ marginTop: 20 }}>
          <p>Create a case → get strategy → practice in the simulator → review debrief.</p>
          <button onClick={() => setPage("intake")}>Start New Negotiation</button>
        </div>
      )}

      {page === "intake" && <Intake nav={nav} />}
      {page === "strategy" && <Strategy nav={nav} />}
      {page === "sim" && <Sim nav={nav} />}
      {page === "debrief" && <Debrief nav={nav} />}
      {page === "history" && <History nav={nav} />}
    </div>
  );
}