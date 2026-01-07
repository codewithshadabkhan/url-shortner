import express from "express";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validations/request.validation.js";

import { getUserByEmail, signupNewUser } from "../services/user.service.js";
import { hashPasswordWithSalt } from "../utils/has.js";
import { createUserToken } from "../utils/token.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { firstName, lastName, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser)
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });
  const user = await signupNewUser(firstName, lastName, email, password);
  return res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { email, password } = validationResult.data;
  const user = await getUserByEmail(email);
  if (!user)
    return res
      .status(404)
      .json({ error: `User with this ${email} not found!` });
  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    user.salt
  );
  if (user.password !== hashedPassword)
    return res.status(400).json({ error: "Invalid credentials" });
  const token = await createUserToken({ id: user.id });
  return res.status(200).json({ token });
});

export default router;
