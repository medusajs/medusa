import { SqlEntityManager } from "@mikro-orm/postgresql"
import { User } from "@models"
import { CreateUserDTO } from "../../../types/dist"

export const createUsers = async (
  manager: SqlEntityManager,
  userData: (CreateUserDTO & { id?: string })[]
) => {
  const users: User[] = []

  for (const user of userData) {
    const usr = manager.create(User, user)
    users.push(usr)
  }

  await manager.persistAndFlush(users)
}
