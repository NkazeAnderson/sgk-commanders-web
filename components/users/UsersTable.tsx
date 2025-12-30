"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Trash,
  Edit,
  MoreHorizontal,
  Plus,
  Funnel,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  MapPin,
} from "lucide-react";
import type { User } from "@/types";
import { users as initialUsers } from "@/mockdata";
import { useUsers } from "@/components/users/UsersContext";
import { useRouter } from "next/navigation";

export default function UsersTable({
  initialData,
}: { initialData?: User[] } = {}) {
  const { users, loading, refresh, deleteUser, updateUser, addUser } =
    useUsers();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();

  React.useEffect(() => {
    if (initialData && initialData.length) {
      // replace the context users by firing refresh (or provider could accept initialData)
      // For simplicity we don't mutate context directly here.
    }
  }, [initialData]);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const allSelected =
    selectedIds.length > 0 && selectedIds.length === users.length;

  function toggleSelectAll() {
    if (allSelected) {
      setSelected({});
      return;
    }

    const next: Record<string, boolean> = {};
    users.forEach((u) => (next[u.id] = true));
    setSelected(next);
  }

  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected users?`)) return;

    const ids = [...selectedIds];
    for (const id of ids) {
      await deleteUser(id);
    }
    setSelected({});
  }

  async function handleDeleteOne(id: string) {
    if (!confirm("Delete user?")) return;
    await deleteUser(id);
    setSelected((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
  }

  const [sort, setSort] = useState<{
    key: keyof User | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.phone ?? "").includes(q) ||
        (u.home_address ?? "").toLowerCase().includes(q) ||
        (u.subcription ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  const sorted = useMemo(() => {
    if (!sort.key || !sort.direction) return filtered;
    const sortedCopy = [...filtered].sort((a, b) => {
      const aVal = (a as any)[sort.key!];
      const bVal = (b as any)[sort.key!];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (sort.key === "created_at") {
        const da = new Date(aVal as string).getTime();
        const db = new Date(bVal as string).getTime();
        return sort.direction === "asc" ? da - db : db - da;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sort.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sortedCopy;
  }, [filtered, sort]);

  function toggleSort(key: keyof User) {
    setSort((s) => {
      if (s.key !== key) return { key, direction: "asc" };
      if (s.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    });
  }

  async function handleAdd() {
    const id = String(Date.now());
    const newUser: User = {
      id,
      name: `New User ${id.slice(-4)}`,
      email: `new${id.slice(-4)}@example.com`,
      phone: 5550000000 + Number(id.slice(-4) || "1"),
      emergency_phone: null,
      home_address: "Unknown",
      accepted_terms: false,
      subcription: "free",
      profile_picture: null,
      created_at: new Date().toISOString(),
      is_safe: null,
      is_agent: false,
      deviceIds: [],
    };

    await addUser(newUser);
    // optionally refresh
    // await refresh();
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold">List</h3>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-[220px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="px-2">
                  <Funnel className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Has image</DropdownMenuItem>
                <DropdownMenuItem>No image</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Recent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={() => toggleSelectAll()}
            aria-label="Select all"
          />

          <div className="text-sm text-muted-foreground">
            {selectedIds.length} selected
          </div>

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash className="size-4" /> Delete
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await refresh();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-auto">
        <Table className="">
          <TableHeader>
            <tr>
              <TableHead className="w-[48px]">
                {/* Empty header for checkboxes */}
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => toggleSort("name")}
                >
                  <span>Name</span>
                  {sort.key !== "name" ? (
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  ) : sort.direction === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => toggleSort("email")}
                >
                  <span>Email</span>
                  {sort.key !== "email" ? (
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  ) : sort.direction === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => toggleSort("phone")}
                >
                  <span>Phone</span>
                  {sort.key !== "phone" ? (
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  ) : sort.direction === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => toggleSort("subcription")}
                >
                  <span>Subscription</span>
                  {sort.key !== "subcription" ? (
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  ) : sort.direction === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">Address</TableHead>
              <TableHead className="hidden lg:table-cell">Agent</TableHead>
              <TableHead className="hidden lg:table-cell">Safe</TableHead>
              <TableHead className="hidden md:table-cell">Emergency</TableHead>
              <TableHead className="hidden lg:table-cell">Accepted</TableHead>
              <TableHead className="hidden lg:table-cell">Expires</TableHead>
              <TableHead className="hidden lg:table-cell">Devices</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => toggleSort("created_at")}
                >
                  <span>Created</span>
                  {sort.key !== "created_at" ? (
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  ) : sort.direction === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[48px]">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {sorted.map((user) => (
              <TableRow
                key={user.id}
                data-state={selected[user.id] ? "selected" : undefined}
                onClick={() => router.push(`/dashboard/users/${user.id}`)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>
                  <Checkbox
                    checked={!!selected[user.id]}
                    onCheckedChange={(checked: any) => {
                      checked;
                      toggleSelect(user.id);
                    }}
                    onClick={(e: any) => e.stopPropagation()}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {user.profile_picture ? (
                        <AvatarImage
                          src={user.profile_picture}
                          alt={user.name}
                        />
                      ) : (
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  {user.email}
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  {user.phone ?? "-"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.subcription ?? "-"}
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  {user.home_address ?? "-"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.is_agent ? "Yes" : "No"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.is_safe === null ? "-" : user.is_safe ? "Yes" : "No"}
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  {user.emergency_phone ?? "-"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.accepted_terms ? "Yes" : "No"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.subcriptionExpiration
                    ? new Date(user.subcriptionExpiration).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.deviceIds?.length ? user.deviceIds.length : 0}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.last_known_location &&
                  typeof user.last_known_location.latitude === "number" &&
                  typeof user.last_known_location.longitude === "number" ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${user.last_known_location.latitude},${user.last_known_location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e: any) => e.stopPropagation()}
                      className="flex items-center gap-1 text-sm text-primary"
                    >
                      <MapPin className="size-4" /> View
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: any) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e: any) => {
                            e.stopPropagation();
                            router.push(`/dashboard/users/${user.id}`);
                          }}
                        >
                          <Edit className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e: any) => {
                            e.stopPropagation();
                            router.push(`/dashboard/users/${user.id}`);
                          }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full text-left p-0"
                            onClick={(e: any) => e.stopPropagation()}
                          >
                            Update
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteOne(user.id)}
                        >
                          <Trash className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        variant="default"
        size="icon-lg"
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-lg",
          "bg-primary text-primary-foreground"
        )}
        onClick={handleAdd}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
