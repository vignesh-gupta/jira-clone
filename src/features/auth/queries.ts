"use server";

import { createSessionClient } from "@/lib/appwrite";

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (e: unknown) {
    console.error("[CURRENT_USER_ERR]",e);
    return null;
  }
};
