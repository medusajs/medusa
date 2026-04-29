import {
  ApiKeyDTO,
  IApiKeyModuleService,
  IAuthModuleService,
  IUserModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import {
  ApiKeyType,
  ContainerRegistrationKeys,
  FeatureFlag,
  generateJwtToken,
  Modules,
  PUBLISHABLE_KEY_HEADER,
} from "@medusajs/framework/utils"
import Scrypt from "scrypt-kdf"
import { getContainer } from "../environment-helpers/use-container"

export const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

export const createAdminUser = async (
  dbConnection,
  adminHeaders,
  container?,
  options?: { email?: string; roles?: string[] }
) => {
  const appContainer = container ?? getContainer()!
  const email = options?.email ?? "admin@medusa.js"

  const userModule: IUserModuleService = appContainer.resolve(Modules.USER)
  const authModule: IAuthModuleService = appContainer.resolve(Modules.AUTH)

  const rbacEnabled = FeatureFlag.isFeatureEnabled("rbac")

  let userRoles = options?.roles

  // If RBAC is enabled and no roles provided, assign super admin role
  if (rbacEnabled && !userRoles) {
    const rbacModule = appContainer.resolve(Modules.RBAC)
    const superAdminRoles = await rbacModule.listRbacRoles({
      id: "role_super_admin",
    })

    userRoles = [superAdminRoles[0].id]
  }

  const user = await userModule.createUsers({
    first_name: "Admin",
    last_name: "User",
    email,
  })

  // Link user to RBAC roles
  if (rbacEnabled && userRoles?.length) {
    const link = appContainer.resolve(ContainerRegistrationKeys.LINK)

    const links = userRoles.map((role_id) => ({
      [Modules.USER]: {
        user_id: user.id,
      },
      [Modules.RBAC]: {
        rbac_role_id: role_id,
      },
    }))

    await link.create(links)
  }

  const hashConfig = { logN: 15, r: 8, p: 1 }
  const passwordHash = await Scrypt.kdf("somepassword", hashConfig)

  const authIdentity = await authModule.createAuthIdentities({
    provider_identities: [
      {
        provider: "emailpass",
        entity_id: email,
        provider_metadata: {
          password: passwordHash.toString("base64"),
        },
      },
    ],
    app_metadata: {
      user_id: user.id,
    },
  })

  const config = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const { projectConfig } = config
  const { jwtSecret, jwtOptions } = projectConfig.http
  const token = generateJwtToken(
    {
      actor_id: user.id,
      actor_type: "user",
      auth_identity_id: authIdentity.id,
      app_metadata: {
        user: user.id,
        roles: userRoles,
      },
    },
    {
      secret: jwtSecret,
      expiresIn: "1d",
      jwtOptions,
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
