import { SqlEntityManager } from "@mikro-orm/postgresql"
import { User } from "@models"

export const createUsers = async (
  manager: SqlEntityManager,
  userData = [{ id: "1" }]
) => {
  const users: User[] = []

  for (const user of userData) {
    const usr = manager.create(User, user)
    users.push(usr)
  }

  await manager.persistAndFlush(users)
}
