import { getWorkspaces } from "@/features/workspaces/action";
import { redirect } from "next/navigation";

export default async function Home() {
  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
