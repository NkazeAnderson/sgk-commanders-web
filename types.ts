import { Url } from "next/dist/shared/lib/router/router";
import { FC } from "react";

export interface SideBarMenuItem {
  displayText: string;
  icon: FC;
  url: Url;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: number;
    emergency_phone: number | null;
    home_address: string;
    accepted_terms: boolean;
    subcription: string;
    last_known_location?: {
        longitude: number;
        latitude: number;
    } | null | undefined;
    created_at?: string | undefined;
    is_safe?: boolean | null | undefined;
    is_agent?: boolean | undefined;
    profile_picture?: string | null | undefined;
    deviceIds?: string[] | null | undefined;
    subcriptionExpiration?: string | undefined;
}