import express from "express";
import { shoternPostRequestBodySchema } from "../validations/request.validation.js";
import { nanoid } from "nanoid";

import { db } from "../db/index.js";
import { urlsTables } from "../models/index.js";
import { create } from "domain";
import { createShortCode } from "../services/url.service.js";

const router = express.Router();

router.post("/shorten", async function (req, res) {
  const userId = req.user?.id;
  console.log(userId);

  if (!userId)
    return res
      .status(401)
      .json({ error: "You must be logged in to access this resource." });

  const validationResult = await shoternPostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error });
  const { url: tragateURL, code } = validationResult.data;

  try {
    const result = await createShortCode(tragateURL, code, userId);
    return res.status(201).json(result);
  } catch (error) {
    //  HANDLE DUPLICATE ERROR
    if (error.code === "23505" || error.cause?.code === "23505") {
      return res.status(409).json({
        error: "duplicate_code",
        message: `The short code '${code}' is already taken. Please choose another one.`,
      });
    }

    // Handle other unknown errors
    console.error("Database Error:", error);
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong. Please try again later.",
    });
  }
});
export default router;
