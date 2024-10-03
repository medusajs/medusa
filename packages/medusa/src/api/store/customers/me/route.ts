import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import {
  StoreGetCustomerParamsType,
  StoreUpdateCustomerType,
} from "../validators"
import { refetchCustomer } from "../helpers"
import { MedusaError } from "@medusajs/framework/utils"
import { updateCustomersWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerParamsType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const id = req.auth_context.actor_id
  const customer = await refetchCustomer(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer with id: ${id} was not found`
    )
  }

  res.json({ customer })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreUpdateCustomerType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const customerId = req.auth_context.actor_id
  await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: customerId },
      update: req.validatedBody,
    },
  })

  const customer = await refetchCustomer(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ customer })
}
