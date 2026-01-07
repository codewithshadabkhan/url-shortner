import express from "express";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { randomBytes, createHmac } from "node:crypto";
import { signupPostRequestBodySchema } from "../validations/request.validation.js";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { firstName, lastName, email, password } = validationResult.data;

  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser)
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });

  const salt = randomBytes(256).toString("hex");
  const hasedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      salt,
      password: hasedPassword,
    })
    .returning({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    });
  return res.status(201).json(user);
});

export default router;
