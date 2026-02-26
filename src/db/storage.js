const CASES_KEY = "nc_cases_v1";
const RUNS_KEY = "nc_runs_v1";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================
   CASES
   ========================= */
export function getCases() {
  return read(CASES_KEY);
}

export function saveCase(newCase) {
  const cases = read(CASES_KEY);
  cases.unshift(newCase);
  write(CASES_KEY, cases);
}

export function getCaseById(id) {
  return getCases().find((c) => c.id === id);
}

/* =========================
   RUNS
   ========================= */
export function getRuns() {
  return read(RUNS_KEY);
}

export function saveRun(newRun) {
  const runs = read(RUNS_KEY);
  runs.unshift(newRun);
  write(RUNS_KEY, runs);
}

export function getRunById(id) {
  return getRuns().find((r) => r.id === id);
}

export function getRunsByCaseId(caseId) {
  return getRuns().filter((r) => r.caseId === caseId);
}