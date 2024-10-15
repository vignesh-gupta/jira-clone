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

    
    if (image instanceof Blob) {
      const fileId = ID.unique();
      const extStr = image.type.split("/")[1];

      console.log({
        extStr, 
        imageType: image.type,
      });
      
      const uploadFile = new File(
        [image],
        `${fileId}.${extStr.indexOf("svg") != -1 ? "svg" : extStr}`,
        { type: image.type }
      );

      const file = await storage.createFile(
        IMAGE_BUCKET_ID,
        fileId,
        uploadFile
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGE_BUCKET_ID,
        file.$id
      );

      uploadedImageUrl = `data:${file.mimeType};base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    } else {
      console.log("No image uploaded");
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({
      success: true,
      data: workspace,
    });
  }
);

export default workspaceApp;
