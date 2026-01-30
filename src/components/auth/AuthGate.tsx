"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, seedIfEmpty } from "@/lib/storage";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty();

    const session = getSession();

    // jika akses dashboard tanpa session -> login
    if (pathname.startsWith("/dashboard") && !session) {
      router.replace("/login");
      return;
    }

    // jika login/register tapi sudah ada session -> dashboard
    if ((pathname === "/login" || pathname === "/register") && session) {
      router.replace("/dashboard");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
