import Image from "next/image";
import Link from "next/link";
import React from "react";
import DottedSeparator from "./dotted-separator";
import Navigation from "./navigation";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"} className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <span className="text-3xl font-extrabold">Jira Clone</span>
      </Link>
      <div className="py-5">
        <DottedSeparator />
      </div>

      <Navigation />
    </aside>
  );
};

export default Sidebar;
