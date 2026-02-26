# Negotiation Coach

A web app that helps users prepare for single-issue negotiations by:
1) collecting key negotiation inputs (Target, Walk-away/Reservation Point, BATNA),
2) generating a strategy (anchoring offer + concession plan + scripts),
3) letting users practice via an interactive negotiation simulator,
4) saving runs and showing a debrief with scoring + an offer-history chart.

## Live Demo
- App: <https://negotiation-coach-ten.vercel.app>

## How to Use
1. Click **New Case** and enter your negotiation info (TP, RP, BATNA).
2. View the **Strategy** page for an opening offer, concession plan, and scripts.
3. Click **Start Simulation** to practice negotiating with a rule-based opponent.
4. After the simulation ends, review the **Debrief** (score + offer chart).
5. Use **History** to revisit past cases and runs.

## Features I’m Proud Of
- **Strategy engine** grounded in negotiation principles (BATNA/RP/TP, anchoring, concessions, agreement-trap warnings).
- **Interactive simulator** with turn-based offers, walk-away logic and round limits.
- **Data visualization**: Offer-history chart comparing user vs bot offers.
- **Persistence**: Cases + runs saved locally (localStorage “database”).

## Tech Stack
- React + Vite
- Chart.js (react-chartjs-2)
- localStorage for persistence (no external APIs)

## Run Locally
```bash
npm install
npm run dev
