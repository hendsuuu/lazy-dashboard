"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              setErr(null);
              try {
                login(email, password);
                router.push("/dashboard");
              } catch (e: any) {
                setErr(e.message ?? "Gagal login");
              }
            }}
          >
            Masuk
          </Button>

          <Button variant="outline" className="w-full" onClick={() => router.push("/register")}>
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
