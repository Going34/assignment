"use client";

import { useEffect, useState } from "react";
import { api, type Event as VyEvent, type MyApplication } from "@/lib/api";

export interface UseEventFiltersOptions {
  allowed: boolean;
}

export function useEventFilters({ allowed }: UseEventFiltersOptions) {
  const [events, setEvents] = useState<VyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortLoading, setSortLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    setSortLoading(true);

    const fetchEvents = async () => {
      try {
        const { events } = await api.get<{ events: VyEvent[] }>(
          `/api/events?sort=${sortDir}`
        );
        if (cancelled) return;

        setEvents(events);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSortLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [allowed, sortDir]);

  function deleteEvent(id: number) {
    setDeletedIds((prev) => [...prev, id]);
  }

  const visibleEvents = events.filter((e) => !deletedIds.includes(e.id));

  return {
    events: visibleEvents,
    loading,
    sortLoading,
    error,
    sortDir,
    setSortDir,
    deleteEvent,
  };
}
