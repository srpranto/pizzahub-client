"use client";

import * as React from "react";
import { toast } from "sonner";
import { apiFetch, ApiClientError } from "@/lib/api";

export interface UseApiQueryOptions<T> {
  initialData?: T | null;
  errorMessage?: string;
  enabled?: boolean;
}

export interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useApiQuery<T>(
  endpoint: string | (() => string | null),
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const { initialData = null, errorMessage, enabled = true } = options;
  const [data, setData] = React.useState<T | null>(initialData);
  const [loading, setLoading] = React.useState<boolean>(enabled);
  const [error, setError] = React.useState<string | null>(null);

  const resolvedEndpoint =
    typeof endpoint === "function" ? endpoint() : endpoint;

  const refetch = React.useCallback(async () => {
    if (!resolvedEndpoint) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{ success?: boolean; data?: T }>(
        resolvedEndpoint
      );
      if (res && typeof res === "object" && "data" in res && res.data !== undefined) {
        setData(res.data);
      } else {
        setData(res as unknown as T);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : errorMessage || "Failed to load data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [resolvedEndpoint, errorMessage]);

  React.useEffect(() => {
    if (enabled && resolvedEndpoint) {
      refetch();
    }
  }, [enabled, resolvedEndpoint, refetch]);

  return { data, loading, error, refetch, setData };
}
