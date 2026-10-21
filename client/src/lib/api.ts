const RAW_BASE = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE = (RAW_BASE || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  errors: Record<string, string>;

  constructor(message: string, status: number, errors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "timecraft.admin.token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  raw?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth, raw, headers, ...rest } = options;
  const finalHeaders = new Headers(headers || {});

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders, body: payload });
  } catch {
    throw new ApiError("We could not reach TIMECRAFT right now. Please check your connection.", 0);
  }

  if (raw) {
    if (!response.ok) {
      throw new ApiError("Request failed", response.status);
    }
    return response as unknown as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string }).message || "Something went wrong. Please try again.",
      response.status,
      (data as { errors?: Record<string, string> }).errors || {},
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options: RequestOptions = {}) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
