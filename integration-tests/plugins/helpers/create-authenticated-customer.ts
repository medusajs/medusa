import { ICustomerModuleService, IAuthModuleService } from "@medusajs/types"

export const createAuthenticatedCustomer = async (
  customerModuleService: ICustomerModuleService,
  authService: IAuthModuleService
) => {
  const customer = await customerModuleService.create({
    first_name: "John",
    last_name: "Doe",
    email: "john@me.com",
  })

  const authUser = await authService.createAuthUser({
    entity_id: "store_user",
    provider_id: "test",
    scope: "store",
    app_metadata: { customer_id: customer.id },
  })

  const jwt = await authService.generateJwtToken(authUser.id, "store")

  return { customer, authUser, jwt }
}
