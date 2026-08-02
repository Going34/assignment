"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, type Participant } from "@/lib/api";

interface CancelModalProps {
  participant: Participant;
  onClose: () => void;
  onCancelled: () => void;
}

export default function CancelModal({
  participant,
  onClose,
  onCancelled,
}: CancelModalProps) {
  const [reason, setReason] = useState("");
  const [cancel, setCancel] = useState(false);

  async function handleCancel() {
    if (!reason.trim()) {
      return;
    }
    setCancel(true);
    try {
      await api.post(`/api/applications/${participant.application_id}/cancel`, {
        reason: reason.trim(),
      });
      onCancelled();
      onClose();
    } catch (err) {
      setCancel(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel registration</DialogTitle>
          <DialogDescription>
            Cancelling{" "}
            <span className="font-semibold text-foreground">
              {participant.name}
            </span>
            . They will see the reason when they log in.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label
            htmlFor="cancel-reason"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Reason *
          </Label>
          <Textarea
            id="cancel-reason"
            rows={3}
            autoFocus
            className="min-h-24 rounded-xl px-4 py-3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleCancel}
            disabled={cancel}
            className="rounded-full cursor-pointer bg-brand-orange-deep text-white hover:bg-brand-orange-deep/90"
          >
            {cancel ? "Cancelling…" : "Cancel registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
