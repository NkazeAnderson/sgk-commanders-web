import AppLogo from "@/components/AppLogo";
import DashboardSideBar from "@/components/navbars/DashboardSideBar";
import DashboardTopBar from "@/components/navbars/DashboardTopBar";
import NavLink from "@/components/navbars/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/mockdata";
import { Group, LayoutDashboard, Users } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React, { FC, PropsWithChildren } from "react";
import { UsersProvider } from "@/components/users/UsersContext";

function dashboardLayout(props: PropsWithChildren) {
  return (
    <UsersProvider>
      <main className="w-full h-full overflow-hidden bg-blue-100">
        <div className="flex w-full h-full">
          <div className="w-1/5 h-full bg-blue-200 flex flex-col gap-14 items-center p-8">
            <div className="flex flex-col items-center">
              <AppLogo />
              <h4 className=" text-blue-700">SGK Commanders</h4>
            </div>
            <DashboardSideBar />
          </div>
          <div className="w-4/5 h-full relative text-blue-black p-10">
            <DashboardTopBar user={users[1]} />
            {props.children}
          </div>
        </div>
      </main>
    </UsersProvider>
  );
}

export default dashboardLayout;
