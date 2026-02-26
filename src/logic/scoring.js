export function scoreRun(c, run) {
  const isBuyer = c.role === "buyer";
  const TP = c.target;
  const RP = c.reservation;

  const outcomePoints =
    run.outcome === "AGREEMENT" ? 100 :
    run.outcome === "WALKED" ? 70 :
    40;

  let valueScore = 0;
  if (run.outcome === "AGREEMENT" && Number.isFinite(run.finalPrice)) {
    const dist = Math.abs(run.finalPrice - TP);
    const range = Math.max(1, Math.abs(RP - TP));
    valueScore = Math.round(100 * (1 - Math.min(1, dist / range)));
  }

  let discipline = 100;
  if (run.outcome === "AGREEMENT" && Number.isFinite(run.finalPrice)) {
    const crossed = isBuyer ? run.finalPrice > RP : run.finalPrice < RP;
    if (crossed) discipline = 20;
  }

  const total = Math.round(0.5 * valueScore + 0.3 * discipline + 0.2 * outcomePoints);
  return { total, valueScore, discipline, outcomePoints };
}