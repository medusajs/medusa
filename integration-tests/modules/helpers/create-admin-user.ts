import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService } from "@medusajs/types"
import jwt from "jsonwebtoken"
import { getContainer } from "../../environment-helpers/use-container"
import adminSeeder from "../../helpers/admin-seeder"

export const createAdminUser = async (
  dbConnection,
  adminHeaders,
  container?
) => {
  await adminSeeder(dbConnection)
  const appContainer = container ?? getContainer()!

  const authModule: IAuthModuleService = appContainer.resolve(
    ModuleRegistrationName.AUTH
  )
  const authUser = await authModule.create({
    provider: "emailpass",
    entity_id: "admin@medusa.js",
    scope: "admin",
    app_metadata: {
      user_id: "admin_user",
    },
  })

  const token = jwt.sign(authUser, "test")
  adminHeaders.headers["authorization"] = `Bearer ${token}`
}
