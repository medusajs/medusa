import { Connection } from "typeorm"
import { User } from "@medusajs/medusa"

export const fakeUserData1 = {
  id: "test",
  email: "test@email.com",
  first_name: "firstname",
  last_name: "lastname",
  password_hash: "password_hash",
}

export const fakeUserData2 = {
  id: "test2",
  email: "test2@email.com",
  first_name: "firstname",
  last_name: "lastname",
  password_hash: "password_hash",
}

export async function retrieveUsers(connection: Connection): Promise<User[]> {
  return await connection.manager
    .createQueryBuilder()
    .select()
    .from(User, "user")
    .orderBy("created_at", "ASC")
    .execute()
}
