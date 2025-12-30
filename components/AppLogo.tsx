import Image from "next/image";
import React from "react";

function AppLogo({ size = 80 }: { size?: number }) {
  return (
    <Image
      width={size}
      height={size}
      className="aspect-square rounded-full"
      src={"/logo.png"}
      alt="Logo"
    />
  );
}

export default AppLogo;
