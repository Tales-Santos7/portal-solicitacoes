import type {
  CreateRequestData,
  Dashboard,
  LoginData,
  LoginResponse,
  RequestFilters,
  RequestItem,
  Status,
  UpdateRequestData,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("auth:expired"));

    throw new ApiError("Sessão expirada. Faça login novamente.", 401);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    const message =
      body?.message ||
      body?.error ||
      "Ocorreu um erro ao comunicar com o servidor.";

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function buildQuery(filters: RequestFilters = {}) {
  const params = new URLSearchParams();

  if (filters.title?.trim()) {
    params.set("title", filters.title.trim());
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export const api = {
  login: (data: LoginData) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: async () => {
    const response = await request<{
      user: User;
    }>("/auth/me");

    return response.user;
  },

  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
    }),

  dashboard: () => request<Dashboard>("/requests/dashboard"),

  requests: (filters: RequestFilters = {}) =>
    request<RequestItem[]>(`/requests${buildQuery(filters)}`),

  getRequest: (id: number) => request<RequestItem>(`/requests/${id}`),

  createRequest: (data: CreateRequestData) =>
    request<RequestItem>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateRequest: (id: number, data: UpdateRequestData) =>
    request<RequestItem>(`/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteRequest: (id: number) =>
    request<void>(`/requests/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: number, status: Status) =>
    request<RequestItem>(`/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }),
};

export { ApiError };
