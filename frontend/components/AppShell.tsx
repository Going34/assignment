"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";


export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const hideNavbar = pathname.startsWith("/login");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
