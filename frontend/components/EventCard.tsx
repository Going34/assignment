"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api, formatDate, type Event as VyEvent } from "@/lib/api";

interface EventCardProps {
  event: VyEvent;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

export default function EventCard({ event, isAdmin, onDelete }: EventCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.del(`/api/events/${event.id}`);
      onDelete(event.id);
    } catch {
      window.alert("Could not delete the event.");
      setDeleting(false);
    }
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden  transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 border-b px-5 pt-3 pb-2 md:pt-5 md:pb-4 md:min-h-26 lg:min-h-32 ">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
            Event #{event.id}
          </p>
          <h3 className="mt-1 text-lg lg:line-clamp-3 line-clamp-2 font-bold leading-snug">{event.name}</h3>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {event.participant_count ?? 0} joined
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {event.description || "No description yet."}
        </p>
        <div className="mt-auto space-y-1.5 text-sm text-muted-foreground">
          <p> {event.location || "TBD"}</p>
          <p> {formatDate(event.date)}</p>
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2 px-5 py-4">
        <Button
          render={<Link href={`/events/${event.id}`} />}
          className="flex-1 rounded-full "
        >
          View Details →
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="outline"
              render={<Link href={`/events/${event.id}/edit`} />}
              className="rounded-full cursor-pointer px-4 text-xs"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full cursor-pointer px-4 text-xs"
            >
              {deleting ? "…" : "Delete"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
