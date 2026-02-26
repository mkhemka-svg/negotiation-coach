import { useMemo, useState } from "react";
import { getCaseById, saveRun } from "../db/storage";
import { initBot, botRespond } from "../logic/opponentBot";

export default function Sim({ nav }) {
  const c = useMemo(() => getCaseById(nav.activeCaseId), [nav.activeCaseId]);

  const [bot, setBot] = useState(() => initBot(c));
  const [userOffer, setUserOffer] = useState("");
  const [ended, setEnded] = useState(false);

  const [rounds, setRounds] = useState([]); // structured round history
  const [log, setLog] = useState(() => [
    { sender: "bot", text: `We propose ${bot.botOffer}` }
  ]);

  function endAndSave(outcome, finalPrice = null) {
    const run = {
      id: crypto.randomUUID(),
      caseId: c.id,
      createdAt: new Date().toISOString(),
      outcome,
      finalPrice,
      botReservation: bot.botReservation,
      rounds,
    };
    saveRun(run);
    nav.setActiveRunId(run.id);
    setEnded(true);
    nav.setPage("debrief");
  }

  function sendOffer() {
    if (ended) return;

    const offer = Number(userOffer);
    if (!Number.isFinite(offer)) return;

    // Check user walk-away (RP)
    const userAcceptable =
      c.role === "buyer" ? offer <= c.reservation : offer >= c.reservation;

    const newLog = [...log, { sender: "you", text: `${offer}` }];

    // If user violates their own RP, treat as "agreement trap" prevention:
    if (!userAcceptable) {
      newLog.push({
        sender: "system",
        text: `That offer crosses your walk-away (RP). Try again or walk away.`,
      });
      setLog(newLog);
      setUserOffer("");
      return;
    }

    const response = botRespond(bot, offer);

    const nextRound = {
      round: rounds.length + 1,
      userOffer: offer,
      botOffer: response.offer,
      botMessage: response.message,
      timestamp: new Date().toISOString(),
    };

    const nextRounds = [...rounds, nextRound];
    setRounds(nextRounds);

    if (response.type === "ACCEPT") {
      newLog.push({ sender: "bot", text: response.message });
      setLog(newLog);
      setUserOffer("");
      // Agreement at the accepted offer
      endAndSave("AGREEMENT", offer);
      return;
    } else {
      newLog.push({ sender: "bot", text: `${response.message} (${response.offer})` });
      setLog(newLog);
      setUserOffer("");
    }

    // Max rounds
    if (nextRounds.length >= c.maxRounds) {
      newLog.push({ sender: "system", text: "Max rounds reached. Negotiation ended." });
      setLog(newLog);
      endAndSave("TIMEOUT", null);
    }
  }

  function walkAway() {
    if (ended) return;
    const newLog = [...log, { sender: "system", text: "You chose to walk away." }];
    setLog(newLog);
    endAndSave("WALKED", null);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Simulation: {c.title}</h2>

      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
        <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
          <b>Your Target (TP):</b> {c.target} <br />
          <b>Your Walk-away (RP):</b> {c.reservation} <br />
          <b>Rounds:</b> {rounds.length}/{c.maxRounds}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          height: 260,
          overflowY: "auto",
          marginTop: 12,
          borderRadius: 10,
        }}
      >
        {log.map((entry, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <b>{entry.sender}:</b> {entry.text}
          </div>
        ))}
      </div>

      {!ended && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
          <input
            value={userOffer}
            onChange={(e) => setUserOffer(e.target.value)}
            placeholder="Enter your numeric offer"
          />
          <button onClick={sendOffer}>Send Offer</button>
          <button onClick={walkAway}>Walk Away</button>
        </div>
      )}
    </div>
  );
}