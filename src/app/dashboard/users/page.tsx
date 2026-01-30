"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/auth/RoleGate";
import { getUsers, updateUserRole, Role } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ROLES: Role[] = ["ADMIN", "MANAGER", "STAFF", "VIEWER"];

export default function UsersPage() {
  const [users, setUsers] = useState(getUsers());

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  return (
    <RoleGate allow={["ADMIN", "MANAGER"]}>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">{u.role}</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {ROLES.map((r) => (
                          <DropdownMenuItem
                            key={r}
                            onClick={() => {
                              updateUserRole(u.id, r);
                              setUsers(getUsers());
                            }}
                          >
                            {r}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </RoleGate>
  );
}
