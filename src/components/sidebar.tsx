import Image from "next/image";
import Link from "next/link";

import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";
import DottedSeparator from "./dotted-separator";
import Navigation from "./navigation";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"} className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <span className="text-3xl font-extrabold">Jira Clone</span>
      </Link>
      <DottedSeparator className="my-3" />

      <WorkspaceSwitcher />
      <DottedSeparator className="my-3" />

      <Navigation />
    </aside>
  );
};

export default Sidebar;
