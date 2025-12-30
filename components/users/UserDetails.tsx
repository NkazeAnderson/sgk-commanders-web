"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUsers } from "./UsersContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import type { User } from "@/types";

export default function UserDetails() {
  const params = useParams();
  const router = useRouter();
  const { users, updateUser, deleteUser } = useUsers();
  const id = params?.id as string;

  const user = users.find((u) => u.id === id);

  const [editing, setEditing] = React.useState(false);

  const form = useForm<Partial<User>>({ defaultValues: user ?? {} });

  React.useEffect(() => {
    form.reset(user ?? {});
  }, [user]);

  if (!user) {
    return <div className="p-4">User not found</div>;
  }

  async function onSubmit(values: Partial<User>) {
    // normalize types from form (strings -> numbers/booleans/arrays)
    const payload: Partial<User> = {
      ...values,
      phone: values.phone ? Number(values.phone as any) : undefined,
      emergency_phone: values.emergency_phone
        ? Number(values.emergency_phone as any)
        : null,
      accepted_terms: !!values.accepted_terms,
      subcriptionExpiration: values.subcriptionExpiration
        ? new Date(values.subcriptionExpiration as any).toISOString()
        : values.subcriptionExpiration,
      deviceIds:
        typeof (values as any).deviceIds === "string"
          ? (values as any).deviceIds
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : (values as any).deviceIds,
    };

    // handle nested lat/long if provided
    const lat = (values as any)?.last_known_location?.latitude;
    const long = (values as any)?.last_known_location?.longitude;
    if (lat && long) {
      payload.last_known_location = {
        latitude: Number(lat),
        longitude: Number(long),
      };
    }

    await updateUser(id, payload);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    router.push("/dashboard/users");
  }

  return (
    <div className="p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <Avatar>
                {user.profile_picture ? (
                  <AvatarImage src={user.profile_picture} alt={user.name} />
                ) : (
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => setEditing((e) => !e)}>
                {editing ? "Cancel" : "Edit"}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-3"
            >
              <label className="flex flex-col">
                <span className="text-sm font-medium">Name</span>
                <input {...form.register("name")} className="input" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Email</span>
                <input {...form.register("email")} className="input" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Phone</span>
                <input {...form.register("phone")} className="input" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Emergency Phone</span>
                <input
                  {...form.register("emergency_phone")}
                  className="input"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Address</span>
                <input {...form.register("home_address")} className="input" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Subscription</span>
                <input {...form.register("subcription")} className="input" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">
                  Subscription Expires
                </span>
                <input
                  type="date"
                  {...form.register("subcriptionExpiration")}
                  className="input"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Accepted Terms</span>
                <input type="checkbox" {...form.register("accepted_terms")} />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">
                  Devices (comma separated)
                </span>
                <input
                  {...(form.register("deviceIds") as any)}
                  className="input"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Location Lat</span>
                  <input
                    {...form.register("last_known_location.latitude" as any)}
                    className="input"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Location Lon</span>
                  <input
                    {...form.register("last_known_location.longitude" as any)}
                    className="input"
                  />
                </label>
              </div>

              <div className="flex gap-2 mt-2">
                <Button type="submit">Save</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{user.phone ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium">{user.home_address ?? "-"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Subscription
                </div>
                <div className="font-medium">{user.subcription ?? "-"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Emergency Phone
                </div>
                <div className="font-medium">{user.emergency_phone ?? "-"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Agent</div>
                <div className="font-medium">
                  {user.is_agent ? "Yes" : "No"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Safe</div>
                <div className="font-medium">
                  {user.is_safe === null ? "-" : user.is_safe ? "Yes" : "No"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
