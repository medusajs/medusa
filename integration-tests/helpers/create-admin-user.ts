import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService, IUserModuleService } from "@medusajs/types"
import jwt from "jsonwebtoken"
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

  const userModule: IUserModuleService = appContainer.resolve(
    ModuleRegistrationName.USER
  )
  const authModule: IAuthModuleService = appContainer.resolve(
    ModuleRegistrationName.AUTH
  )
  const user = await userModule.create({
    first_name: "Admin",
    last_name: "User",
    email: "admin@medusa.js",
  })

  const authIdentity = await authModule.create({
    provider: "emailpass",
    entity_id: "admin@medusa.js",
    provider_metadata: {
      password: "somepassword",
    },
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
    "test"
  )

  adminHeaders.headers["authorization"] = `Bearer ${token}`
}
