import jwt from "jsonwebtoken"
import { ICustomerModuleService, IAuthModuleService } from "@medusajs/types"
import { createAuthToken } from "./create-auth-token"

export const createAuthenticatedCustomer = async (
  customerModuleService: ICustomerModuleService,
  authService: IAuthModuleService,
  jwtSecret: string
) => {
  const customer = await customerModuleService.create({
    first_name: "John",
    last_name: "Doe",
    email: "john@me.com",
  })

  const authUser = await authService.create({
    entity_id: "store_user",
    provider: "emailpass",
    scope: "store",
    app_metadata: { customer_id: customer.id },
  })

  const token = createAuthToken(authUser, jwtSecret)

  return { customer, authUser, jwt: token }
}
