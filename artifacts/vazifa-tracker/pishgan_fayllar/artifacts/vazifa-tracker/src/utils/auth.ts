const SESSION_KEY = "vt_admin_session";
const CRED_KEY = "vt_admin_creds";
const DEFAULT_USER = "msrfteam1";
const DEFAULT_PASS = "msrfteam777";

function getCreds(): { username: string; password: string } {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { username: DEFAULT_USER, password: DEFAULT_PASS };
}

export function login(username: string, password: string): boolean {
  const creds = getCreds();
  if (username === creds.username && password === creds.password) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function checkAdmin(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function getAdminUsername(): string {
  return getCreds().username;
}

export function updateCredentials(username: string, password: string): void {
  localStorage.setItem(CRED_KEY, JSON.stringify({ username, password }));
}
