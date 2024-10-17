import { getCurrentUser } from "@/features/auth/queries";
import { PageWithWorkspaceId } from "@/features/workspaces/types";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceId = async ({ params }: PageWithWorkspaceId) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <div>WorkspaceId: {params.workspaceId}</div>;
};

export default WorkspaceId;
