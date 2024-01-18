import { DALUtils } from "@medusajs/utils"

import { AuthUser } from "@models"
import { RepositoryTypes } from "@types"

export class AuthUserRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  AuthUser,
  {
    create: RepositoryTypes.CreateAuthUserDTO
    update: RepositoryTypes.UpdateAuthUserDTO
  }
>(AuthUser) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
