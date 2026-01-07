import { randomBytes, createHmac } from "node:crypto";

export function hashPasswordWithSalt(password, userSlat = undefined) {
  const salt = userSlat ?? randomBytes(256).toString("hex");
  const hasedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return { salt, password: hasedPassword };
}
