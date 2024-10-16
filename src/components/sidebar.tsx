
import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";
import DottedSeparator from "./dotted-separator";
import Logo from "./logo";
import Navigation from "./navigation";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Logo />
      <DottedSeparator className="my-3" />

      <WorkspaceSwitcher />
      <DottedSeparator className="my-3" />

      <Navigation />
    </aside>
  );
};

export default Sidebar;
