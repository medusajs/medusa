import { CreateCustomerDTO, MedusaContainer } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import jwt from "jsonwebtoken"

export const createAuthenticatedCustomer = async (
  appContainer: MedusaContainer,
  customerData: Partial<CreateCustomerDTO> = {}
) => {
  const { jwt_secret } = appContainer.resolve("configModule").projectConfig
  const authService = appContainer.resolve(ModuleRegistrationName.AUTH)
  const customerModuleService = appContainer.resolve(
    ModuleRegistrationName.CUSTOMER
  )

  const customer = await customerModuleService.create({
    first_name: "John",
    last_name: "Doe",
    email: "john@me.com",
    ...customerData,
  })

  const authUser = await authService.create({
    entity_id: "store_user",
    provider: "emailpass",
    scope: "store",
    app_metadata: { customer_id: customer.id },
  })

  const token = jwt.sign(authUser, jwt_secret)

  return { customer, authUser, jwt: token }
}
