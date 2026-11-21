let cachedClientToken: { token: string; expiresAt: number; userId?: string } | null = null;

export function clearTokenCache() {
  cachedClientToken = null;
}

export async function getToken(forceRefresh = false): Promise<string | null> {
  const now = Date.now();
  if (!forceRefresh && cachedClientToken && cachedClientToken.expiresAt > now + 60000) {
    return cachedClientToken.token;
  }

  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      cachedClientToken = null;
      return null;
    }

    const data = (await res.json()) as { token?: string };
    if (data.token) {
      let sub: string | undefined;
      try {
        if (typeof window !== "undefined") {
          const parts = data.token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1])) as { sub?: string };
            sub = typeof payload.sub === "string" ? payload.sub : undefined;
          }
        }
      } catch {
        // Ignore decoding failure
      }

      cachedClientToken = {
        token: data.token,
        userId: sub,
        expiresAt: now + 15 * 60 * 1000,
      };
      return data.token;
    }
  } catch {
    cachedClientToken = null;
    return null;
  }

  return null;
}
