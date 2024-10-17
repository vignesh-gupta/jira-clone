import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

type GetMembersProps = {
  databases: Databases;
  workspaceId: string;
  userId: string;
};

export const getMembers = async ({
  databases,
  userId,
  workspaceId,
}: GetMembersProps) => {
  const member = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", userId),
    Query.equal("workspaceId", workspaceId),
  ]);

  return member.documents[0];
};
