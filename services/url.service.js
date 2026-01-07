import { nanoid } from "nanoid";

import { db } from "../db/index.js";
import { urlsTables } from "../models/index.js";

export async function createShortCode(tragateURL, code, userId) {
  const shortCode = code || nanoid(6);

  const [result] = await db
    .insert(urlsTables)
    .values({
      shortCode,
      tragateURL,
      userId: userId,
    })
    .returning({
      id: urlsTables.id,
      shortCode: urlsTables.shortCode,
      tragateURL: urlsTables.tragateURL,
    });

  return result;
}
