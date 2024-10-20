import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createTaskSchema, getTasksSchema } from "../schema";
import { Task } from "../types";

const taskApp = new Hono();

export default taskApp
  .get(
    "/",
    zValidator("query", getTasksSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { users } = await createAdminClient()

      const { workspaceId, projectId, status, assigneeId, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        workspaceId,
        userId: user.$id,
        databases,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) query.push(Query.equal("projectId", projectId));
      if (status) query.push(Query.equal("status", status));
      if (assigneeId) query.push(Query.equal("assigneeId", assigneeId));
      if (search) query.push(Query.search("name", search));
      if (dueDate) query.push(Query.lessThanEqual("dueDate", dueDate));

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);
      
      const projectIds = Array.from(new Set(tasks.documents.map((task) => task.projectId)));
      
      const assigneeIds = Array.from(new Set(tasks.documents.map((task) => task.assigneeId)));
      
      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length  > 0
          ? [Query.contains("$id", projectIds)]
          : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0
          ? [Query.contains("$id", assigneeIds)]
          : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      )


      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          ({$id }) => $id === task.projectId
        );

        const assignee = assignees.find(
          ({ $id }) => $id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      })


      return c.json({ data: {
        ...tasks,
        documents: populatedTasks,
      } });
    }
  )
  .post(
    "/",
    zValidator("json", createTaskSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const {
        name,
        status,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      const members = await getMember({
        workspaceId,
        userId: user.$id,
        databases,
      });

      if (!members) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPriorityTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("projectId", projectId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPriorityTasks.total > 0
          ? highestPriorityTasks.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          description,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  );
