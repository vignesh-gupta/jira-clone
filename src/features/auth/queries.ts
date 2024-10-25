"use server";

import { createSessionClient } from "@/lib/appwrite";

export const getCurrentUser = async () => {
  const client = await createSessionClient();

  if(!client) return null;

  return (await client.account.get()) ?? null;
};
