import { DALUtils } from "@medusajs/utils"

import { AuthProvider } from "@models"
import { RepositoryTypes } from "@types"

export class AuthProviderRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  AuthProvider,
  {
    create: RepositoryTypes.CreateAuthProviderDTO
    update: RepositoryTypes.UpdateAuthProviderDTO
  }
>(AuthProvider) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
