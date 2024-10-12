import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;