"use client";

import CancelModal from "@/components/CancelModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  api,
  type Participant,
  type Event as VyEvent
} from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { useState } from "react";

export default function EventParticipants({ event }: { event: VyEvent }) {
  const [cancelTarget, setCancelTarget] = useState<Participant | null>(null);

  const { data, loading, refetch } = useResource(
    () =>
      api.get<{ participants: Participant[] }>(
        `/api/events/${event.id}/participants`,
      ),
    [event.id],
  );

  if (loading && !data) {
    return <Skeleton className="h-44 w-full rounded-2xl" />;
  }

  const participants = data?.participants ?? [];
  const active = participants.filter((p) => p.status === "applied");
  const cancelledList = participants.filter((p) => p.status === "cancelled");

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex-row items-center justify-between gap-3 pt-3">
        <div>
          <CardTitle>Registered Participants</CardTitle>
          <p className="text-xs text-muted-foreground">
            Manage volunteer registrations for this event
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {active.length} active · {cancelledList.length} cancelled
        </Badge>
      </CardHeader>

      <ul className="divide-y">
        {active.map((p) => (
          <li
            key={p.application_id}
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.email}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setCancelTarget(p)}
              className="rounded-full cursor-pointer"
            >
              Cancel registration
            </Button>
          </li>
        ))}
        {cancelledList.map((p) => (
          <li
            key={p.application_id}
            className="flex flex-wrap items-center justify-between gap-3 bg-orange-50/50 px-6 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground line-through">
                  {p.name}
                </p>
                <p className="text-xs text-brand-orange-deep">
                  Cancelled — {p.cancel_reason}
                </p>
              </div>
            </div>
            <Badge className="bg-white text-brand-orange-deep ring-1 ring-brand-orange/30">
              Cancelled
            </Badge>
          </li>
        ))}
      </ul>

      {cancelTarget && (
        <CancelModal
          participant={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onCancelled={refetch}
        />
      )}
    </Card>
  );
}
