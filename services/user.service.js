import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { hashPasswordWithSalt } from "../utils/has.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return existingUser;
}

export async function signupNewUser(firstName, lastName, email, password) {
  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      salt,
      password: hashedPassword,
    })
    .returning({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    });
  return user;
}
