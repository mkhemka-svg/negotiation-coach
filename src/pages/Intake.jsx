import { useMemo, useState } from "react";
import { saveCase } from "../db/storage";

export default function Intake({ nav }) {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("buyer");
  const [target, setTarget] = useState("");
  const [reservation, setReservation] = useState("");
  const [batna, setBatna] = useState("");
  const [opponentStyle, setOpponentStyle] = useState("collaborative");
  const [maxRounds, setMaxRounds] = useState(8);
  const [error, setError] = useState("");

  const parsed = useMemo(() => {
    return {
      t: Number(target),
      r: Number(reservation),
      b: Number(batna),
    };
  }, [target, reservation, batna]);

  function validate() {
    if (!title.trim()) return "Please enter a title.";
    if (isNaN(parsed.t)) return "Target must be a number.";
    if (isNaN(parsed.r)) return "Reservation must be a number.";
    if (isNaN(parsed.b)) return "BATNA must be a number.";

    if (role === "buyer" && parsed.r < parsed.t)
      return "Buyer RP must be >= Target.";
    if (role === "seller" && parsed.r > parsed.t)
      return "Seller RP must be <= Target.";

    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    const newCase = {
      id: crypto.randomUUID(),
      title,
      role,
      target: parsed.t,
      reservation: parsed.r,
      batna: parsed.b,
      opponentStyle,
      maxRounds,
      createdAt: new Date().toISOString(),
    };

    saveCase(newCase);

    nav.setActiveCaseId(newCase.id);
    nav.setPage("strategy");
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>New Negotiation</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <input
          placeholder="Target price"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          placeholder="Walk-away / RP"
          value={reservation}
          onChange={(e) => setReservation(e.target.value)}
        />

        <input
          placeholder="BATNA value"
          value={batna}
          onChange={(e) => setBatna(e.target.value)}
        />

        <select
          value={opponentStyle}
          onChange={(e) => setOpponentStyle(e.target.value)}
        >
          <option value="aggressive">Aggressive</option>
          <option value="collaborative">Collaborative</option>
          <option value="anchoring">Anchoring</option>
          <option value="slow">Slow concessions</option>
        </select>

        {error && (
          <div style={{ color: "red" }}>
            {error}
          </div>
        )}

        <button type="submit">Save & Generate Strategy</button>
      </form>
    </div>
  );
}