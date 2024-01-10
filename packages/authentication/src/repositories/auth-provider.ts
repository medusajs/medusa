import { DALUtils } from "@medusajs/utils"

import { AuthProvider } from "@models"
import { RepositoryTypes } from "@types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Context } from "@medusajs/types"

export class AuthProviderRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  AuthProvider,
  "provider"
) {
  async update(
    data: RepositoryTypes.UpdateAuthProviderDTO[],
    context: Context = {}
  ): Promise<AuthProvider[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const authProviders = data.map(({ provider, update }) => {
      return manager.assign(provider, update)
    })

    manager.persist(authProviders)

    return authProviders
  }
}
