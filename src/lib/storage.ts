export type Role = "ADMIN" | "MANAGER" | "STAFF" | "VIEWER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string; // demo only (plain text). JANGAN untuk production.
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
  role: Role;
};

const USERS_KEY = "inv_users";
const SESSION_KEY = "inv_session";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function seedIfEmpty() {
  const users = getUsers();
  if (users.length) return;

  const admin: User = {
    id: crypto.randomUUID(),
    name: "Admin",
    email: "admin@demo.com",
    role: "ADMIN",
    password: "admin123",
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  return safeParse<User[]>(localStorage.getItem(USERS_KEY), []);
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  return safeParse<Session | null>(localStorage.getItem(SESSION_KEY), null);
}

export function setSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function registerUser(input: { name: string; email: string; password: string }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("Email sudah digunakan");
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    role: "STAFF",
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  const next = [user, ...users];
  saveUsers(next);

  setSession({ userId: user.id, email: user.email, role: user.role });
  return user;
}

export function login(email: string, password: string) {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) throw new Error("Email / password salah");

  setSession({ userId: user.id, email: user.email, role: user.role });
  return user;
}

export function currentUser(): User | null {
  const s = getSession();
  if (!s) return null;
  const users = getUsers();
  return users.find((u) => u.id === s.userId) ?? null;
}

export function updateUserRole(userId: string, role: Role) {
  const users = getUsers();
  const next = users.map((u) => (u.id === userId ? { ...u, role } : u));
  saveUsers(next);

  // kalau update role user yang sedang login
  const s = getSession();
  if (s?.userId === userId) setSession({ ...s, role });
}
