import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

import { AuthUser } from "@models"
import { RepositoryTypes } from "@types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class AuthUserRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  AuthUser
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: RepositoryTypes.CreateAuthUserDTO[],
    context: Context = {}
  ): Promise<AuthUser[]> {
    const toCreate = data.map((authUser) => {
      const authUserClone = { ...authUser } as any

      authUserClone.provider ??= authUser.provider_id

      return authUserClone
    })

    return await super.create(toCreate, context)
  }

  async update(
    data: RepositoryTypes.UpdateAuthUserDTO[],
    context: Context = {}
  ): Promise<AuthUser[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const authUsers = data.map(({ user, update }) => {
      return manager.assign(user, update)
    })

    manager.persist(authUsers)

    return authUsers
  }
}
