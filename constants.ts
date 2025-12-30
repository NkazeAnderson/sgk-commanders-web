import { SideBarMenuItem } from "./types";
import {
  DollarSign,
  File,
  Group,
  LayoutDashboard,
  Siren,
  Users,
} from "lucide-react";

export const sideBarMenuItems: SideBarMenuItem[] = [
  { displayText: "Home", url: "/dashboard", icon: LayoutDashboard },
  { displayText: "Users", url: "/dashboard/users", icon: Users },
  { displayText: "Groups and Families", url: "/dashboard/groups", icon: Group },
  { displayText: "Alerts", url: "/dashboard/alerts", icon: Siren },
  { displayText: "Reports", url: "/dashboard/reports", icon: File },
  { displayText: "Payments", url: "/dashboard/payments", icon: DollarSign },
];