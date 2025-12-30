import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import NavLink from "./NavLink";
import AppLogo from "../AppLogo";

function GeneralNavBar() {
  return (
    <nav className="flex flex-row justify-between items-center p-10 sticky top-0 z-50 bg-[#040720f4]">
      <Link href={"/"}>
        <AppLogo />
      </Link>
      <div className="flex gap-4 items-center font-semibold text-white">
        <NavLink href={"/"}>Home</NavLink>
        <NavLink href="/login">About us</NavLink>
        <NavLink href="/login">Contact us</NavLink>
        <NavLink href="/login">Pricing</NavLink>
        <Link href={"/login"}>
          <Button
            className="ml-14 border-blue-900 bg-transparent text-blue-900 font-semibold hover:bg-blue-600"
            size={"lg"}
            variant={"outline"}
          >
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default GeneralNavBar;
