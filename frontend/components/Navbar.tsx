"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-navy shadow-sm transition group-hover:scale-105">
        <img src="/logo.png" alt="Volunteer Yatra Logo" className="h-5 w-5 object-contain" />
      </span>
      <span className="leading-none">
        <span className="block text-lg font-bold tracking-tight text-brand-ink">
          Volunteer
        </span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.35em] text-brand-orange">
          Yatra
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        {user && (
          <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition hover:bg-muted hover:text-foreground"
            >
              Events
            </Link>
            {user.role === "admin" && (
              <Link
                href="/create"
                className="rounded-full px-4 py-2 transition hover:bg-muted hover:text-foreground"
              >
                Create Event
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="outline"
                className="rounded-full cursor-pointer px-4"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button render={<Link href="/login" />} className="rounded-full cursor-pointer px-5">
              Login
            </Button>
          )}
        </div>
      </div>

      {user && (
        <nav className="flex items-center gap-1 border-t border-border px-4 py-2 text-sm font-medium text-muted-foreground md:hidden">
          <Link href="/" className="rounded-full px-3 py-1.5 hover:bg-muted">
            Events
          </Link>
          {user.role === "admin" && (
            <Link href="/create" className="rounded-full px-3 py-1.5 hover:bg-muted">
              Create Event
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
