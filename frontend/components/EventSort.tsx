"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventSortProps {
  sortDir: "asc" | "desc";
  onSortDirChange: (value: "asc" | "desc") => void;
  totalCount: number;
}

export default function EventSort({
  sortDir,
  onSortDirChange,
  totalCount,
}: EventSortProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-5 py-3.5 shadow-xs">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{totalCount}</span>{" "}
        event{totalCount === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort by date:
        </span>
        <Select
          value={sortDir}
          onValueChange={(v) => onSortDirChange((v ?? "asc") as "asc" | "desc")}
        >
          <SelectTrigger className="h-9 w-44 rounded-xl">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Earliest</SelectItem>
            <SelectItem value="desc">Latest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
