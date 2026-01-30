"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, Role } from "@/lib/storage";

export default function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    if (!allow.includes(session.role)) {
      router.replace("/dashboard");
    }
  }, [allow, router]);

  return <>{children}</>;
}
