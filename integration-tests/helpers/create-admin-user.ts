import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IAuthModuleService, IUserModuleService } from "@medusajs/types"
import jwt from "jsonwebtoken"
import { getContainer } from "../environment-helpers/use-container"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
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
  const remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const user = await userModule.create({
    first_name: "Admin",
    last_name: "User",
    email: "admin@medusa.js",
  })

  const authIdentity = await authModule.create({
    provider: "emailpass",
    entity_id: "admin@medusa.js",
    scope: "admin",
    provider_metadata: {
      password: "somepassword",
    },
  })

  // Ideally we simulate a signup process than manually linking here.
  await remoteLink.create([
    {
      [Modules.USER]: {
        user_id: user.id,
      },
      [Modules.AUTH]: {
        auth_identity_id: authIdentity.id,
      },
    },
  ])

  const token = jwt.sign(
    {
      actor_id: user.id,
      actor_type: "user",
      auth_identity_id: authIdentity.id,
      scope: "admin",
      app_metadata: {},
    },
    "test"
  )

  adminHeaders.headers["authorization"] = `Bearer ${token}`
}
