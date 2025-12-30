"use client";

import React from "react";
import type { User } from "@/types";
import { users as mockUsers } from "@/mockdata";

type UsersContextValue = {
  users: User[];
  loading: boolean;
  refresh: () => Promise<void>;
  addUser: (user: User) => Promise<User | null>;
  updateUser: (id: string, data: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
};

const UsersContext = React.createContext<UsersContextValue | undefined>(
  undefined
);

export function useUsers() {
  const ctx = React.useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}

export function UsersProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: User[];
}) {
  const [users, setUsers] = React.useState<User[]>(initialData ?? []);
  const [loading, setLoading] = React.useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      setUsers(json.users ?? mockUsers);
    } catch (err) {
      console.error("Failed to refresh users:", err);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // load on mount
    if (initialData && initialData.length) {
      setUsers(initialData);
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addUser(user: User) {
    // Optimistic update
    setUsers((s) => [user, ...s]);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Failed to add user");
      const json = await res.json();
      // replace optimistic user (match by id)
      setUsers((s) => [json.user, ...s.filter((u) => u.id !== json.user.id)]);
      return json.user as User;
    } catch (err) {
      console.error("Failed to add user:", err);
      // revert
      setUsers((s) => s.filter((u) => u.id !== user.id));
      return null;
    }
  }

  async function updateUser(id: string, data: Partial<User>) {
    const prev = users;
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, ...data } : u)));
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const json = await res.json();
      setUsers((s) => s.map((u) => (u.id === id ? json.user : u)));
      return json.user as User;
    } catch (err) {
      console.error("Failed to update user:", err);
      // revert
      setUsers(prev);
      return null;
    }
  }

  async function deleteUser(id: string) {
    const prev = users;
    setUsers((s) => s.filter((u) => u.id !== id));
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return true;
    } catch (err) {
      console.error("Failed to delete user:", err);
      // revert
      setUsers(prev);
      return false;
    }
  }

  return (
    <UsersContext.Provider
      value={{ users, loading, refresh, addUser, updateUser, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  );
}
