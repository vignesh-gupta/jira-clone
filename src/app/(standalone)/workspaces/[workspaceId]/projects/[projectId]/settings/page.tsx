import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import DeleteProjectForm from "@/features/projects/components/delete-project-form";
import EditProjectForm from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { PagePropsWithProjectIdParam } from "@/lib/types";

const ProjectIdSettingsPage = async ({
  params: { projectId },
}: PagePropsWithProjectIdParam) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const initialValue = await getProject({ projectId });

  return (
    <div className="w-full lg:max-w-2xl">
      <div className="flex flex-col gap-y-4">
        <EditProjectForm initialValues={initialValue} />
        <DeleteProjectForm projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectIdSettingsPage;
