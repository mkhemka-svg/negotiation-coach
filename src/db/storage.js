const RUNS_KEY = "nc_runs_v1";

// ... keep your existing read/write/getCases/saveCase/getCaseById above

export function getRuns() {
  return read(RUNS_KEY);
}

export function saveRun(newRun) {
  const runs = read(RUNS_KEY);
  runs.unshift(newRun);
  write(RUNS_KEY, runs);
}

export function getRunById(id) {
  return getRuns().find(r => r.id === id);
}

export function getRunsByCaseId(caseId) {
  return getRuns().filter(r => r.caseId === caseId);
}