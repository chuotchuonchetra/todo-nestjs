const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let accessToken = null; // kept in memory only; the refresh cookie restores it

async function refreshAccessToken() {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    accessToken = null;
    throw new Error("Session expired");
  }
  accessToken = (await res.json()).accessToken;
}

async function request(path, { method = "GET", body, retried = false } = {}) {
  const start = performance.now();
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // without it the browser never sends the cookie
    body: body ? JSON.stringify(body) : undefined,
  }).catch((e) => {
    if (import.meta.env.DEV) console.error(`[api] ${method} ${path} failed`, e);
    throw e;
  });

  if (import.meta.env.DEV) {
    const ms = Math.round(performance.now() - start);
    console.debug(`[api] ${method} ${path} ${res.status} - ${ms}ms`, body ?? "");
  }

  // access token expired: refresh once, then replay the request
  if (res.status === 401 && !retried && !path.startsWith("/auth/")) {
    await refreshAccessToken();
    return request(path, { method, body, retried: true });
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? message;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  login: async (email, password) => {
    accessToken = (await request("/auth/login", { method: "POST", body: { email, password } })).accessToken;
  },
  register: async (email, password) => {
    accessToken = (await request("/auth/register", { method: "POST", body: { email, password } })).accessToken;
  },
  // on app start: restore the session from the refresh cookie
  restoreSession: () => refreshAccessToken().then(() => true, () => false),
  logout: async () => {
    await request("/auth/logout", { method: "POST" });
    accessToken = null;
  },
  getTodos: () => request("/todos"),
  createTodo: (todo) => request("/todos", { method: "POST", body: todo }),
  updateTodo: (id, updates) => request(`/todos/${id}`, { method: "PATCH", body: updates }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: "DELETE" }),
  reorderTodos: (ids) => request("/todos/reorder", { method: "PUT", body: { ids } }),
  bulkStatus: (ids, status) =>
    request("/todos/bulk/status", { method: "PATCH", body: { ids, status } }),
  bulkDelete: (ids) => request("/todos/bulk", { method: "DELETE", body: { ids } }),
  getUser: () => request("/auth/me"),
  saveUser: (user) => request("/user", { method: "PUT", body: user }),
  resetDemo: () => request("/demo/reset", { method: "POST" }),
};
