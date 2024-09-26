import {
  ApiKeyDTO,
  IApiKeyModuleService,
  IAuthModuleService,
  IUserModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import {
  ApiKeyType,
  Modules,
  PUBLISHABLE_KEY_HEADER,
} from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import Scrypt from "scrypt-kdf"
import { getContainer } from "../environment-helpers/use-container"

export const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

export const createAdminUser = async (
  dbConnection,
  adminHeaders,
  container?
) => {
  const appContainer = container ?? getContainer()!

  const userModule: IUserModuleService = appContainer.resolve(Modules.USER)
  const authModule: IAuthModuleService = appContainer.resolve(Modules.AUTH)
  const user = await userModule.createUsers({
    first_name: "Admin",
    last_name: "User",
    email: "admin@medusa.js",
  })

  const hashConfig = { logN: 15, r: 8, p: 1 }
  const passwordHash = await Scrypt.kdf("somepassword", hashConfig)

  const authIdentity = await authModule.createAuthIdentities({
    provider_identities: [
      {
        provider: "emailpass",
        entity_id: "admin@medusa.js",
        provider_metadata: {
          password: passwordHash.toString("base64"),
        },
      },
    ],
    app_metadata: {
      user_id: user.id,
    },
  })

  const token = jwt.sign(
    {
      actor_id: user.id,
      actor_type: "user",
      auth_identity_id: authIdentity.id,
    },
    "test",
    {
      expiresIn: "1d",
    }
  )

  adminHeaders.headers["authorization"] = `Bearer ${token}`

  return { user, authIdentity }
}

export const generatePublishableKey = async (container?: MedusaContainer) => {
  const appContainer = container ?? getContainer()!
  const apiKeyModule = appContainer.resolve<IApiKeyModuleService>(
    Modules.API_KEY
  )

  return await apiKeyModule.createApiKeys({
    title: "test publishable key",
    type: ApiKeyType.PUBLISHABLE,
    created_by: "test",
  })
}

export const generateStoreHeaders = ({
  publishableKey,
}: {
  publishableKey: ApiKeyDTO
}) => {
  return {
    headers: {
      [PUBLISHABLE_KEY_HEADER]: publishableKey.token,
    },
  }
}
