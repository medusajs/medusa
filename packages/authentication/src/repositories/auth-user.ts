import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

import { AuthUser } from "@models"
import { RepositoryTypes } from "@types"

export class AuthUserRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  AuthUser
) {
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
}
