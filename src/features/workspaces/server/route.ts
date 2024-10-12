import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";
import { workspaceSchema } from "../schemas";

const workspaceApp = new Hono().post(
  "/",
  zValidator("json", workspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );

    return c.json({
      success: true,
      data: workspace,
    });
  }
);

export default workspaceApp;
