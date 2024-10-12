import { Hono } from "hono";

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { loginSchema, registerSchema } from "@/lib/zod-schemas";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";

const authApp = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return c.json({ success: true });
    } catch (error) {
      return c.json({
        error: (error as Error)?.message ?? "An error occurred",
        success: false,
      });
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return c.json({
        success: true,
      });
    } catch (e) {
      return c.json({
        error: (e as Error)?.message ?? "An error occurred",
        success: false,
      });
    }
  })
  .post("/logout", async (c) => {
    deleteCookie(c, AUTH_COOKIE_NAME);

    return c.json({ success: true });
  });

export default authApp;
