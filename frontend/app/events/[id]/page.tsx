"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ApplySection from "@/components/ApplySection";
import EmptyState from "@/components/EmptyState";
import EventHero from "@/components/EventHero";
import EventParticipants from "@/components/EventParticipants";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Event as VyEvent, type User } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { user } = useRequireAuth();

  const [justApplied, setJustApplied] = useState(false);

  const { data, loading, error } = useResource(
    () => api.get<{ event: VyEvent }>(`/api/events/${eventId}`),
    [eventId],
  );

  if (loading && !data) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <EmptyState
          as="h1"
          titleClassName="text-xl"
          title="Event not found"
          description={error?.message ?? "It may have been removed."}
          action={
            <a href="/" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">
              ← Back to events
            </a>
          }
        />
      </main>
    );
  }

  const event = data.event;
  const joinedCount = (event.participant_count ?? 0) + (justApplied ? 1 : 0);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <EventHero event={event} user={user!} joinedCount={joinedCount} />

      <Card className="overflow-hidden py-0 rounded-t-none border-t-0">
        <CardContent className="px-8 py-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            About this project
          </p>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
            {event.description || "No description provided by the host yet."}
          </p>

          <div className={user?.role == "admin" ? "hidden" : "mt-8 border-t pt-6"}>
            <ApplySection
              eventId={eventId}
              onApplied={() => setJustApplied(true)}
            />
          </div>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <div className="mt-8">
          <EventParticipants event={event} />
        </div>
      )}
    </main>
  );
}
