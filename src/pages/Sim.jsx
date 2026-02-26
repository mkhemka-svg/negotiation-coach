import { useMemo, useState } from "react";
import { getCaseById, saveRun } from "../db/storage";
import { initBot, botRespond } from "../logic/opponentBot";

export default function Sim({ nav }) {
  const c = useMemo(() => getCaseById(nav.activeCaseId), [nav.activeCaseId]);

  const [{ bot, rounds, log, ended }, setGame] = useState(() => {
    const b = initBot(c);
    return {
      bot: b,
      rounds: [],
      ended: false,
      log: [{ sender: "bot", text: `We propose ${b.botOffer}` }],
    };
  });

  const [userOffer, setUserOffer] = useState("");

  const roundLabel = useMemo(() => {
    if (ended) return `Completed ${rounds.length}/${c.maxRounds}`;
    const current = Math.min(rounds.length + 1, c.maxRounds);
    return `Round ${current} of ${c.maxRounds}`;
  }, [ended, rounds.length, c.maxRounds]);

  function endAndSave(outcome, finalPrice = null, finalRounds = rounds) {
    const run = {
      id: crypto.randomUUID(),
      caseId: c.id,
      createdAt: new Date().toISOString(),
      outcome,
      finalPrice,
      botReservation: bot.botReservation,
      rounds: finalRounds,
    };

    saveRun(run);
    nav.setActiveRunId(run.id);

    setGame((prev) => ({
      ...prev,
      ended: true,
    }));

    nav.setPage("debrief");
  }

  function sendOffer() {
    if (ended) return;

    const offer = Number(userOffer);
    if (!Number.isFinite(offer)) {
      setGame((prev) => ({
        ...prev,
        log: [...prev.log, { sender: "system", text: "Enter a valid number." }],
      }));
      return;
    }

    const userAcceptable =
      c.role === "buyer" ? offer <= c.reservation : offer >= c.reservation;

    if (!userAcceptable) {
      setGame((prev) => ({
        ...prev,
        log: [
          ...prev.log,
          { sender: "you", text: `${offer}` },
          {
            sender: "system",
            text: "That crosses your walk-away (RP). Adjust or walk away.",
          },
        ],
      }));
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

    const nextLog = [
      ...log,
      { sender: "you", text: `${offer}` },
      response.type === "ACCEPT"
        ? { sender: "bot", text: response.message }
        : { sender: "bot", text: `${response.message} (${response.offer})` },
    ];

    setGame((prev) => ({
      ...prev,
      rounds: nextRounds,
      log: nextLog,
    }));

    setUserOffer("");

    if (response.type === "ACCEPT") {
      endAndSave("AGREEMENT", offer, nextRounds);
      return;
    }

    if (nextRounds.length >= c.maxRounds) {
      endAndSave("TIMEOUT", null, nextRounds);
    }
  }

  function walkAway() {
    if (ended) return;

    setGame((prev) => ({
      ...prev,
      log: [...prev.log, { sender: "system", text: "You chose to walk away." }],
      ended: true,
    }));

    endAndSave("WALKED", null, rounds);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Simulation: {c.title}</h2>

      {/* Stats Card */}
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            backgroundColor: "#f3f4f6",
            border: "1px solid #e5e7eb",
            minWidth: 280,
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Your Target (TP):
            </span>{" "}
            <span style={{ color: "#111827" }}>{c.target}</span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Your Walk-away (RP):
            </span>{" "}
            <span style={{ color: "#111827" }}>{c.reservation}</span>
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 0.3,
            }}
          >
            {roundLabel}
          </div>
        </div>
      </div>

      {/* Chat Log */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          height: 280,
          overflowY: "auto",
          marginTop: 14,
          borderRadius: 10,
        }}
      >
        {log.map((entry, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <b>{entry.sender}:</b> {entry.text}
          </div>
        ))}
      </div>

      {/* Controls */}
      {!ended && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
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