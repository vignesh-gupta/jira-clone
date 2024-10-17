"use server";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { getMembers } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE_NAME);

    if (!session) return { documents: [], total: 0 };

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.documents.length === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceId = members.documents.map((member) => member.workspaceId);

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceId)]
    );

    return workspace;
  } catch (e: unknown) {
    console.error(e);
    return { documents: [], total: 0 };
  }
};

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE_NAME);

    if (!session) return null;

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);

    const user = await account.get();

    const member = await getMembers({
      userId: user.$id,
      workspaceId,
      databases,
    });

    if (!member) return null;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch (e: unknown) {
    console.error(e);
    return null;
  }
};
