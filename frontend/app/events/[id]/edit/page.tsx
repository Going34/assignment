"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import EventForm, { type EventFormValues } from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError, type Event as VyEvent } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { loading: authLoading, allowed } = useRequireAuth("admin");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data, loading, error } = useResource(
    () => api.get<{ event: VyEvent }>(`/api/events/${eventId}`),
    [eventId],
  );

  async function handleSubmit(values: EventFormValues) {
    setServerError(null);
    try {
      await api.put(`/api/events/${eventId}`, {
        name: values.name,
        description: values.description,
        date: new Date(values.date).toISOString(),
        location: values.location,
      });
      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : "Could not save the event.",
      );
      throw err;
    }
  }

  if (authLoading || !allowed) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </main>
    );
  }


  const event = data.event;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mt-1 text-2xl font-bold">{event.name}</h1>
          </div>
        </div>

        <EventForm
          initial={{
            name: event.name,
            description: event.description,
            date: event.date,
            location: event.location,
          }}
          submitLabel="Save changes"
          busyLabel="Saving…"
          onCancelHref={`/events/${event.id}`}
          onSubmit={handleSubmit}
          serverError={serverError}
        />
      </div>
    </main>
  );
}
