import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import WorkspaceIdClientPage from "./client";

const WorkspaceId = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdClientPage />;
};

export default WorkspaceId;
