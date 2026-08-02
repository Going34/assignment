"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventForm, { type EventFormValues } from "@/components/EventForm";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";

export default function CreateEventPage() {
  const { loading: authLoading, allowed } = useRequireAuth("admin");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: EventFormValues) {
    setError(null);
    try {
      await api.post("/api/events", {
        name: values.name,
        description: values.description,
        date: new Date(values.date).toISOString(),
        location: values.location,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not create the event.",
      );
      throw err;
    }
  }

  if (authLoading || !allowed) {
    return (
      <>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </main>
      </>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to events
        </Link>

        <div className="animate-fade-up">
          <h1 className="mt-1 text-3xl font-bold">Create a new event</h1>
          <EventForm
            submitLabel="Create Event →"
            busyLabel="Creating…"
            onCancelHref="/"
            serverError={error}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  );
}
