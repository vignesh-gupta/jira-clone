import { Hono } from "hono";

import { loginSchema, registerSchema } from "@/lib/zod-schemas";
import { zValidator } from "@hono/zod-validator";

const authApp = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    return c.json({
      email,
      password,
    });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    return c.json({
      name,
      email,
      password,
    });
  });

export default authApp;
