import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberROLE } from "@/features/members/types";
import { getMembers } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";

const workspaceApp = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.documents.length === 0) {
      return c.json({
        success: true,
        data: {
          documents: [],
        },
      });
    }

    const workspaceId = members.documents.map((member) => member.workspaceId);

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceId)]
    );

    return c.json({
      success: true,
      data: workspace,
    });
  })
  .post(
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
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberROLE.ADMIN,
      });

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { image, name } = c.req.valid("form");

      const member = await getMembers({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member || member.role !== MemberROLE.ADMIN) {
        return c.json(
          {
            success: false,
            error: "Unauthorized",
          },
          401
        );
      }

      let uploadedImageUrl: string | undefined;

      console.log({ image });

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const extStr = image.type.split("/")[1];

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

        uploadedImageUrl = image;
      }

      console.log({ name, uploadedImageUrl });

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl ?? null,
        }
      );

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberROLE.ADMIN) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    // TODO: Delete Members, projects & tasks
    
    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      success: true,
      data: {
        $id: workspaceId,
      },
    });
  });

export default workspaceApp;
