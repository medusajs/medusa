import { CreateCustomerDTO, MedusaContainer } from "@medusajs/types"

import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import jwt from "jsonwebtoken"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const createAuthenticatedCustomer = async (
  appContainer: MedusaContainer,
  customerData: Partial<CreateCustomerDTO> = {}
) => {
  const { http } = appContainer.resolve("configModule").projectConfig
  const authService = appContainer.resolve(ModuleRegistrationName.AUTH)
  const customerModuleService = appContainer.resolve(
    ModuleRegistrationName.CUSTOMER
  )
  const remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const customer = await customerModuleService.create({
    first_name: "John",
    last_name: "Doe",
    email: "john@me.com",
    ...customerData,
  })

  const authIdentity = await authService.create({
    entity_id: "store_user",
    provider: "emailpass",
  })

  // Ideally we simulate a signup process than manually linking here.
  await remoteLink.create([
    {
      [Modules.CUSTOMER]: {
        customer_id: customer.id,
      },
      [Modules.AUTH]: {
        auth_identity_id: authIdentity.id,
      },
    },
  ])

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
