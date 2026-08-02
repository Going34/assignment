"use client";

import NoticeCard from "@/components/NoticeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type MyApplication } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { useState } from "react";

export default function ApplySection({
  eventId,
  onApplied,
}: {
  eventId: number;
  onApplied: () => void;
}) {
  const [applying, setApplying] = useState(false);
  const { user } = useAuth()
console.log('user',user)
  const { data, loading, refetch } = useResource(
    () => api.get<{ applications: MyApplication[] }>("/api/me/applications"),
    [eventId],
  );

  async function handleApply() {
    setApplying(true);
    try {
      await api.post(`/api/events/${eventId}/apply`);
      onApplied();
      refetch();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not apply.");
    } finally {
      setApplying(false);
    }
  }

  if (loading && !data) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  const myApp = data?.applications.find((a) => a.event_id === eventId) ?? null;
  const isCancelled = myApp?.status === "cancelled";
  const hasApplied = myApp?.status === "applied";

  return (
    <>
      {isCancelled && (
        <NoticeCard
          className="mb-4"
          title={
            <span className="text-brand-orange-deep">
              Your registration was cancelled
            </span>
          }
          description={`Reason: ${myApp?.cancel_reason}`}
        />
      )}

      {user?.role == "admin" ? <> </> : hasApplied ? (
        <p className="mb-4 text-sm font-medium text-green-600">
          You are registered for this event.
        </p>
      ) : (
        <Button
          onClick={handleApply}
          disabled={applying}
          className="w-full rounded-full cursor-pointer sm:w-auto"
        >
          {applying
            ? "Applying…"
            : isCancelled
              ? "Apply again →"
              : "Apply to this project →"}
        </Button>
      )}
    </>
  );
}
