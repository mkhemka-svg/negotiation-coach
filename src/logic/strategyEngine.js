function makePrecise(n) {
  // Make it look “precise” (e.g., 2437) to leverage precision anchoring
  const rounded = Math.round(n / 10) * 10;
  return rounded + 7;
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

export function generateStrategy(c) {
  const { role, target: TP, reservation: RP, batna: BATNA, opponentStyle } = c;

  const isBuyer = role === "buyer";

  // 1) Opening anchor (first offer) — based on TP/RP spread, made precise
  // Buyer anchors below TP; Seller anchors above TP
  const spread = Math.abs(RP - TP);
  const rawAnchor = isBuyer ? TP - 0.35 * spread : TP + 0.35 * spread;
  const anchor = makePrecise(rawAnchor);

  // 2) Concession plan (5 steps)
  // Step from anchor -> TP -> close to RP (without crossing RP)
  const steps = [];
  const numSteps = 5;

  const finalLimit = isBuyer
    ? clamp(RP, TP, RP) // buyer RP is higher
    : clamp(RP, RP, TP); // seller RP is lower

  for (let i = 0; i < numSteps; i++) {
    const t = i / (numSteps - 1);
    const step = Math.round(anchor + t * (TP - anchor));
    steps.push(step);
  }

  // Add a final “near RP” option if TP is far from RP
  const nearRP = isBuyer ? Math.round(RP * 0.98) : Math.round(RP * 1.02);

  const warnings = [];
  // 3) BATNA / agreement trap warning (notes)
  // If RP is worse than BATNA, warn user their RP may be mis-set
  if (isBuyer && RP > BATNA) {
    warnings.push("Check your numbers: your walk-away (RP) is worse than your BATNA. Avoid the agreement trap—don’t accept a deal worse than your alternative.");
  }
  if (!isBuyer && RP < BATNA) {
    warnings.push("Check your numbers: your walk-away (RP) is worse than your BATNA. Avoid the agreement trap—don’t accept a deal worse than your alternative.");
  }

  // 4) Style-based tactic (counter-anchor immediately if aggressive)
  const styleTips = {
    aggressive:
      "If they open with an extreme offer, counteroffer immediately to re-anchor (don’t ask them to justify the number). Keep concessions small and tied to rationale.",
    collaborative:
      "Ask open-ended questions to uncover interests. Make bilateral concessions (tradeoffs) so the other side feels satisfied and follows through.",
    anchoring:
      "Expect them to cling to their first number. Counter-anchor confidently with a precise offer and a short objective rationale.",
    slow:
      "Expect little movement early. Don’t concede too fast—save movement for later rounds and keep asking probing questions."
  };

  // 5) Scripts grounded in notes (open questions + reciprocity + tradeoffs)
  const scripts = [
    "Help me understand what’s driving that number.",
    "If we can get closer to [YOUR TARGET], I can be flexible on [LOW-PRIORITY TERM].",
    "What flexibility do you have on price if we adjust timing or other terms?",
    "I can’t go past my walk-away point, but I want to find a solution that works for both of us."
  ];

  return {
    anchor,
    concessionPlan: steps,
    nearRP,
    tips: styleTips[opponentStyle] || styleTips.collaborative,
    warnings,
    scripts
  };
}