"use client";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, PropsWithChildren, ReactNode } from "react";

interface NavLinkT extends PropsWithChildren {
  href: Url;
}

function NavLink(props: NavLinkT) {
  const path = usePathname();
  const isActive = path.toLowerCase() === props.href;
  return (
    <Link href={props.href} className={`  ${!isActive ? "" : "text-blue-600"}`}>
      {props.children}
    </Link>
  );
}

export default NavLink;
