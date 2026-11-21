import { getToken, clearTokenCache } from "./token";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers = new Headers(options.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint}`;

  let res = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized or forbidden with cached token, retry once with fresh token
  if ((res.status === 401 || res.status === 403) && token) {
    clearTokenCache();
    const freshToken = await getToken(true);
    if (freshToken && freshToken !== token) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      res = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  let data: Record<string, unknown> = {};
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      data = (await res.json()) as Record<string, unknown>;
    } catch {
      data = {};
    }
  }

  if (!res.ok) {
    const errorFromData =
      typeof data.error === "string"
        ? data.error
        : typeof data.message === "string"
        ? data.message
        : null;
    const errorMessage =
      errorFromData ?? `Request failed with status ${res.status}`;
    throw new ApiClientError(errorMessage, res.status, data);
  }

  return data as T;
}
