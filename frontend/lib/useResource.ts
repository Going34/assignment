"use client";

import { useEffect, useState, type DependencyList } from "react";

export interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useResource<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await fetcher();
        if (!active) return;
        setData(res);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [...deps, reloadKey]);

  const refetch = () => setReloadKey((k) => k + 1);

  return { data, loading, error, refetch };
}
