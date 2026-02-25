import { useState } from "react";
import Intake from "./pages/Intake";

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCaseId, setActiveCaseId] = useState(null);

  const nav = { page, setPage, activeCaseId, setActiveCaseId };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Negotiation Coach</h1>

      <button onClick={() => setPage("intake")}>
        Start New Negotiation
      </button>

      {page === "intake" && <Intake nav={nav} />}

      {page === "strategy" && (
        <div>
          <h2>Strategy Page Coming Next...</h2>
          <p>Active Case ID: {activeCaseId}</p>
        </div>
      )}
    </div>
  );
}