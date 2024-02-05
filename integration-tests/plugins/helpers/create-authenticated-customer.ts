import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"

import jwt from "jsonwebtoken"

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

  const authUser = await authService.createAuthUser({
    entity_id: "store_user",
    provider: "emailpass",
    scope: "store",
    app_metadata: { customer_id: customer.id },
  })

  const token = jwt.sign(authUser, jwtSecret)

  return { customer, authUser, jwt: token }
}
