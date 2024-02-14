import { AuthUser } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export async function createAuthUsers(
  manager: SqlEntityManager,
  userData: any[] = [
    {
      id: "test-id",
      entity_id: "test-id",
      provider: "manual",
      scope: "store",
    },
    {
      id: "test-id-1",
      entity_id: "test-id-1",
      provider: "manual",
      scope: "store",
    },
    {
      entity_id: "test-id-2",
      provider: "store",
      scope: "store",
    },
  ]
): Promise<AuthUser[]> {
  const authUsers: AuthUser[] = []

  for (const user of userData) {
    const authUser = manager.create(AuthUser, user)

    authUsers.push(authUser)
  }

  await manager.persistAndFlush(authUsers)

  return authUsers
}
