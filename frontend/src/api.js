const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please ensure the backend is running.",
    );
  }

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const validationMessages = Array.isArray(payload?.errors)
      ? payload.errors.map((item) => item.message).join(". ")
      : "";

    const message =
      validationMessages ||
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload;
}

export const api = {
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),

  me: () => request("/auth/me"),

  getMyProfile: () => request("/users/me"),

  updateMyProfile: (data) =>
    request("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
  changeMyPassword: (data) => request("/users/me/password", { method: "PATCH", body: JSON.stringify(data) }),

  getTransactions: (params = "") =>
    request(`/transactions${params ? `?${params}` : ""}`),

  createTransaction: (data) =>
    request("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCategories: () => request("/categories"),

  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),

  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  getBudgets: () => request("/budgets"),

  createBudget: (data) =>
    request("/budgets", { method: "POST", body: JSON.stringify(data) }),

  updateBudget: (id, data) =>
    request(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteBudget: (id) => request(`/budgets/${id}`, { method: "DELETE" }),

  getSummary: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate });
    return request(`/summary?${params}`);
  },

  getExpensesByCategory: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate });
    return request(`/summary/expenses-by-category?${params}`);
  },

  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTransaction: (id) =>
    request(`/transactions/${id}`, {
      method: "DELETE",
    }),
};
