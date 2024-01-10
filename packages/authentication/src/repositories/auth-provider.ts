import { DALUtils } from "@medusajs/utils"

import { AuthProvider } from "@models"

export class AuthProviderRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  AuthProvider,
  "provider"
) {}
