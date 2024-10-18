"use server";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./types";
import { getMember } from "../members/utils";

export const getProject = async ({ projectId }: { projectId: string }) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    userId: user.$id,
    workspaceId: project.workspaceId,
    databases,
  });

  if (!member) throw new Error("Unauthorized");

  return project;
};
