import GeneralNavBar from "@/components/navbars/GeneralNavBar";
import React, { PropsWithChildren } from "react";

function layout(props: PropsWithChildren) {
  return (
    <div className="bg-blue-black w-full h-full overflow-y-scroll">
      <GeneralNavBar />
      {props.children}
    </div>
  );
}

export default layout;
