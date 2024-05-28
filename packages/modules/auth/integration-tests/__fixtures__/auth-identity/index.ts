import { AuthIdentity } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export async function createAuthIdentities(
  manager: SqlEntityManager,
  userData: any[] = [
    {
      id: "test-id",
      entity_id: "test-id",
      provider: "manual",
    },
    {
      id: "test-id-1",
      entity_id: "test-id-1",
      provider: "manual",
    },
    {
      entity_id: "test-id-2",
      provider: "store",
    },
  ]
): Promise<AuthIdentity[]> {
  const authIdentities: AuthIdentity[] = []

  for (const user of userData) {
    const authIdentity = manager.create(AuthIdentity, user)

    authIdentities.push(authIdentity)
  }

  await manager.persistAndFlush(authIdentities)

  return authIdentities
}
