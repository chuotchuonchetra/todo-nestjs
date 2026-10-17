const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request(path, { method = "GET", body } = {}) {
  const start = performance.now();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).catch((e) => {
    if (import.meta.env.DEV) console.error(`[api] ${method} ${path} failed`, e);
    throw e;
  });

  if (import.meta.env.DEV) {
    const ms = Math.round(performance.now() - start);
    console.debug(`[api] ${method} ${path} ${res.status} - ${ms}ms`, body ?? "");
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
  getTodos: () => request("/todos"),
  createTodo: (todo) => request("/todos", { method: "POST", body: todo }),
  updateTodo: (id, updates) => request(`/todos/${id}`, { method: "PATCH", body: updates }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: "DELETE" }),
  reorderTodos: (ids) => request("/todos/reorder", { method: "PUT", body: { ids } }),
  bulkStatus: (ids, status) =>
    request("/todos/bulk/status", { method: "PATCH", body: { ids, status } }),
  bulkDelete: (ids) => request("/todos/bulk", { method: "DELETE", body: { ids } }),
  getUser: () => request("/user"),
  saveUser: (user) => request("/user", { method: "PUT", body: user }),
  resetDemo: () => request("/demo/reset", { method: "POST" }),
};
