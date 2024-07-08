import { CreateCustomerDTO, MedusaContainer } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/utils"
import jwt from "jsonwebtoken"

export const createAuthenticatedCustomer = async (
  appContainer: MedusaContainer,
  customerData: Partial<CreateCustomerDTO> = {}
) => {
  const { http } = appContainer.resolve("configModule").projectConfig
  const authService = appContainer.resolve(ModuleRegistrationName.AUTH)
  const customerModuleService = appContainer.resolve(
    ModuleRegistrationName.CUSTOMER
  )

  const customer = await customerModuleService.createCustomers({
    first_name: "John",
    last_name: "Doe",
    email: "john@me.com",
    ...customerData,
  })

  const authIdentity = await authService.createAuthIdentities({
    provider_identities: [
      {
        entity_id: "store_user",
        provider: "emailpass",
      },
    ],
    app_metadata: {
      customer_id: customer.id,
    },
  })

  const token = jwt.sign(
    {
      actor_id: customer.id,
      actor_type: "customer",
      auth_identity_id: authIdentity.id,
    },
    http.jwtSecret
  )

  return { customer, authIdentity, jwt: token }
}
