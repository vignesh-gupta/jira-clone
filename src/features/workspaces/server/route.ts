import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { DATABASE_ID, IMAGE_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const workspaceApp = new Hono().post(
  "/",
  zValidator("form", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const storage = c.get("storage");

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGE_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGE_BUCKET_ID,
        file.$id
      );

      uploadedImageUrl = `data:${file.mimeType};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        image: uploadedImageUrl,
      }
    );

    return c.json({
      success: true,
      data: workspace,
    });
  }
);

export default workspaceApp;
