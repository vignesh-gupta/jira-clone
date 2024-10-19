import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/queries";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { PagePropsWithProjectIdParam } from "@/lib/types";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";


const ProjectIdPage = async ({ params: { projectId } }: PagePropsWithProjectIdParam) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const initialValue = await getProject({ projectId });

  if (!initialValue) notFound()

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValue.name}
            image={initialValue.imageUrl}
            className="size-9"
          />
          <p className="text-lg font-semibold">{initialValue.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValue.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectIdPage;
