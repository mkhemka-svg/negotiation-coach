const CASES_KEY = "nc_cases_v1";

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

export function getCases() {
  return read(CASES_KEY);
}

export function saveCase(newCase) {
  const cases = read(CASES_KEY);
  cases.unshift(newCase);
  write(CASES_KEY, cases);
}

export function getCaseById(id) {
  return getCases().find(c => c.id === id);
}