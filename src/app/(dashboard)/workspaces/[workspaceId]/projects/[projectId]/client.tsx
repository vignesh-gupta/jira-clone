"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import PageLoader from "@/components/page-loader";

const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: initialValue, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;

  if (!initialValue) throw new Error("Project not found");

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
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdClient;
