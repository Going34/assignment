"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface EventFormValues {
  name: string;
  description: string;
  date: string; 
  location: string;
}


export function toLocalDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({
  submitLabel,
  busyLabel,
  initial,
  onCancelHref,
  onSubmit,
  serverError,
}: {
  submitLabel: string;
  busyLabel: string;
  initial?: { name?: string; description?: string; date?: string; location?: string } | null;
  onCancelHref: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
  serverError: string | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ? toLocalDatetimeLocal(initial.date) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await onSubmit({ name, description, date, location });
    } catch {
      
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-8 p-0">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Event Name *
          </Label>
          <Input
            id="name"
            required
            maxLength={200}
            className="h-10 rounded-xl px-4"
            placeholder="e.g. Front Desk Manager & Content Creator"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            rows={5}
            maxLength={5000}
            className="min-h-32 rounded-xl px-4 py-3"
            placeholder="Tell volunteers what the project is about…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date & Time *
            </Label>
            <Input
              id="date"
              type="datetime-local"
              required
              className="h-10 rounded-xl px-4"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Location
            </Label>
            <Input
              id="location"
              maxLength={200}
              className="h-10 rounded-xl px-4"
              placeholder="e.g. Gude, Goa"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {serverError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={busy} className="rounded-full px-6">
            {busy ? busyLabel : submitLabel}
          </Button>
          <Button variant="outline" render={<Link href={onCancelHref} />} className="rounded-full px-6">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
