import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

type WorkspaceSettingsPageProps = {
  params: {
    workspaceId: string;
  };
};

const WorkspaceSettingsPage = async ({
  params: { workspaceId },
}: WorkspaceSettingsPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspace({ workspaceId });

  if (!workspace) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceSettingsPage;
