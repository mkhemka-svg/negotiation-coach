import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Negotiation Coach</h1>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage("intake")}>
          Start New Negotiation
        </button>
      </div>

      {page === "intake" && (
        <div style={{ marginTop: 30 }}>
          <h2>Intake Page Coming Next...</h2>
        </div>
      )}
    </div>
  );
}