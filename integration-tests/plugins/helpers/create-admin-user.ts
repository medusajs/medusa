import { IAuthModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import adminSeeder from "../../helpers/admin-seeder"
import { getContainer } from "../../environment-helpers/use-container"
import jwt from "jsonwebtoken"

export const createAdminUser = async (dbConnection, adminHeaders) => {
  await adminSeeder(dbConnection)
  const appContainer = getContainer()!

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
