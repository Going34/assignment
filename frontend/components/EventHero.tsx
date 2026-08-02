import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, type Event as VyEvent, type User } from "@/lib/api";

export default function EventHero({
  event,
  user,
  joinedCount,
}: {
  event: VyEvent;
  user: User;
  joinedCount: number;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
          ← All events
        </Link>
        {user.role === "admin" && (
          <Button
            variant="outline"
            render={<Link href={`/events/${event.id}/edit`} />}
            className="rounded-full cursor-pointer px-4 text-xs"
          >
            Edit event
          </Button>
        )}
      </div>

      <div className="bg-brand-navy px-8 py-10 text-white rounded-t-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90">
            Event #{event.id}
          </Badge>
          <Badge className="bg-white/10 text-white hover:bg-white/20">
            {joinedCount} volunteer
            {joinedCount === 1 ? "" : "s"} joined
          </Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight">
          {event.name}
        </h1>
        <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/75">
          <span> {event.location || "TBD"}</span>
          <span> {formatDate(event.date)}</span>
        </p>
      </div>
    </>
  );
}
