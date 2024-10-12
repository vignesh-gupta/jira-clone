import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/action";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    const pathname = headers().get("x-pathname") || "/";
    const currentEncodedURL = encodeURIComponent(pathname);
    redirect("/sign-in?q=" + currentEncodedURL);
  }

  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm />
    </div>
  );
}
