"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  
  as?: "h1" | "h2";
  
  titleClassName?: string;
  compact?: boolean;
  muted?: boolean;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  as: Heading = "h2",
  titleClassName,
  compact = false,
  muted = false,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("py-0", className)}>
      <CardContent
        className={cn(
          "px-6 text-center",
          compact ? "py-8" : "py-16",
        )}
      >
        {icon && <p className="text-4xl">{icon}</p>}
        <Heading
          className={cn(
            "text-lg font-bold",
            icon ? "mt-3" : "",
            muted && "font-medium text-muted-foreground",
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}
