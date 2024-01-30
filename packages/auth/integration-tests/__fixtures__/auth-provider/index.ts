import { SqlEntityManager } from "@mikro-orm/postgresql"
import { AuthProvider } from "@models"

export async function createAuthProviders(
  manager: SqlEntityManager,
  providerData: any[] = [
    {
      provider: "manual",
      name: "manual",
      is_active: true,
    },
    {
      provider: "disabled",
      name: "disabled",
    },
    {
      provider: "store",
      name: "store",
      domain: "store",
      is_active: true,
    },
    {
      provider: "admin",
      name: "admin",
      domain: "admin",
      is_active: true,
    },
  ]
): Promise<AuthProvider[]> {
  const authProviders: AuthProvider[] = []

  for (const provider of providerData) {
    const authProvider = manager.create(AuthProvider, provider)

    authProviders.push(authProvider)
  }

  await manager.persistAndFlush(authProviders)

  return authProviders
}
