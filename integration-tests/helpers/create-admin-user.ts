import { IAuthModuleService, IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import jwt from "jsonwebtoken"
import { getContainer } from "../environment-helpers/use-container"

export const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

export const createUserAndAuthIdentity = async (container?) => {
  const appContainer = container ?? getContainer()!

  const userModule: IUserModuleService = appContainer.resolve(
    ModuleRegistrationName.USER
  )
  const authModule: IAuthModuleService = appContainer.resolve(
    ModuleRegistrationName.AUTH
  )
  const user = await userModule.createUsers({
    first_name: "Tony",
    last_name: "Start",
    email: "tony@start.com",
  })

  const authIdentity = await authModule.createAuthIdentities({
    provider_identities: [
      {
        provider: "emailpass",
        entity_id: "tony@start.com",
        provider_metadata: {
          password: "somepassword",
        },
      },
    ],
    app_metadata: {
      user_id: user.id,
    },
  })

  return { user, authIdentity }
}

export const createAdminUser = async (
  dbConnection,
  adminHeaders,
  container?
) => {
  const appContainer = container ?? getContainer()!

  const userModule: IUserModuleService = appContainer.resolve(
    ModuleRegistrationName.USER
  )
  const authModule: IAuthModuleService = appContainer.resolve(
    ModuleRegistrationName.AUTH
  )
  const user = await userModule.createUsers({
    first_name: "Admin",
    last_name: "User",
    email: "admin@medusa.js",
  })

  const authIdentity = await authModule.createAuthIdentities({
    provider_identities: [
      {
        provider: "emailpass",
        entity_id: "admin@medusa.js",
        provider_metadata: {
          password: "somepassword",
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

  return { user }
}
