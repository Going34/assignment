"use client";

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import EventCard from "@/components/EventCard";
import EventSort from "@/components/EventSort";
import NoticeCard from "@/components/NoticeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth";
import { useEventFilters } from "@/lib/useEventFilters";

function EventsPageSkeleton() {
  return (
    <div className="animate-fade-up">
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { user, loading: authLoading, allowed } = useRequireAuth();
  const {
    events,
    loading,
    sortLoading,
    sortDir,
    setSortDir,
    deleteEvent,
  } = useEventFilters({ allowed });

  if (authLoading || !allowed || (loading && events.length === 0)) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <EventsPageSkeleton />
      </main>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4  sm:px-6">
      {events.length > 0 && (
        <EventSort
          sortDir={sortDir}
          onSortDirChange={setSortDir}
          totalCount={events.length}
        />
      )}

      <section className="mt-8">
        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description={
              isAdmin
                ? "Create the first event to get started."
                : "Check back soon — new adventures are on the way."
            }
          />
        ) : (
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${
              sortLoading ? "opacity-60" : "opacity-100"
            }`}
          >
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                onDelete={(id) => deleteEvent(id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
