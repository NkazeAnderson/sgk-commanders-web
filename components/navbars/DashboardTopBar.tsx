"use client";

import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { usePathname } from "next/navigation";
import { sideBarMenuItems } from "@/constants";
import { User } from "@/types";

function DashboardTopBar(props: { user: User }) {
  const route = usePathname();
  const activeRoute = sideBarMenuItems.find(
    (item) => item.url.toString().toLowerCase() === route.toLowerCase()
  );

  return (
    <div className="w-full flex justify-between items-center">
      <h2 className=" capitalize">{activeRoute?.displayText ?? ""}</h2>

      <div className="flex items-center gap-4">
        <p className="font-semibold">{props.user.name} </p>
        <Avatar>
          <AvatarImage
            src={props.user.profile_picture ?? ""}
            alt="profile picture"
          />
          <AvatarFallback>{props.user.name[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default DashboardTopBar;
