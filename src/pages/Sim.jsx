import { useState } from "react";
import { getCaseById } from "../db/storage";
import { initBot, botRespond } from "../logic/opponentBot";

export default function Sim({ nav }) {
  const c = getCaseById(nav.activeCaseId);
  const [bot, setBot] = useState(() => initBot(c));
  const [userOffer, setUserOffer] = useState("");
  const [log, setLog] = useState([
    { sender: "bot", text: `We propose ${bot.botOffer}` }
  ]);
  const [ended, setEnded] = useState(false);

  function sendOffer() {
    if (ended) return;

    const offer = Number(userOffer);
    if (isNaN(offer)) return;

    const newLog = [...log, { sender: "you", text: offer }];

    const response = botRespond(bot, offer);

    if (response.type === "ACCEPT") {
      newLog.push({ sender: "bot", text: response.message });
      setLog(newLog);
      setEnded(true);
    } else {
      newLog.push({
        sender: "bot",
        text: `${response.message} (${response.offer})`
      });
      setLog(newLog);
    }

    setUserOffer("");
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Simulation: {c.title}</h2>

      <div style={{
        border: "1px solid #ddd",
        padding: 12,
        height: 250,
        overflowY: "auto",
        marginBottom: 12
      }}>
        {log.map((entry, i) => (
          <div key={i}>
            <b>{entry.sender}:</b> {entry.text}
          </div>
        ))}
      </div>

      {!ended && (
        <div>
          <input
            value={userOffer}
            onChange={(e) => setUserOffer(e.target.value)}
            placeholder="Enter your offer"
          />
          <button onClick={sendOffer}>Send Offer</button>
        </div>
      )}

      {ended && (
        <div>
          <h3>Negotiation Ended</h3>
          <button onClick={() => nav.setPage("strategy")}>
            Back to Strategy
          </button>
        </div>
      )}
    </div>
  );
}