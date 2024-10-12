"use server";

import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

export const getCurrentUser = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE_NAME);

    if (!session) return null;

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch (e: unknown) {
    console.error(e);
    return null;
  }
};
