import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceId = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <div>WorkspaceId</div>;
};

export default WorkspaceId;
