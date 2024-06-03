import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { MedusaError } from "@medusajs/utils"

import { createCustomerAccountWorkflow } from "@medusajs/core-flows"
import { refetchCustomer } from "./helpers"
import { StoreCreateCustomerType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreateCustomerType>,
  res: MedusaResponse
) => {
  // If `actor_id` is present, the request carries authentication for an existing customer
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a customer."
    )
  }

  const createCustomers = createCustomerAccountWorkflow(req.scope)
  const customersData = req.validatedBody

  const { result } = await createCustomers.run({
    input: { customersData, authIdentityId: req.auth_context.auth_identity_id },
  })

  const customer = await refetchCustomer(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}
