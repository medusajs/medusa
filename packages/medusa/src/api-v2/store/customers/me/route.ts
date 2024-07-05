import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import {
  StoreGetCustomerParamsType,
  StoreUpdateCustomerType,
} from "../validators"
import { refetchCustomer } from "../helpers"
import { MedusaError } from "@medusajs/utils"
import { updateCustomersWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerParamsType>,
  res: MedusaResponse
) => {
  const id = req.auth.actor_id
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
  res: MedusaResponse
) => {
  const customerId = req.auth.actor_id
  const { errors } = await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: customerId },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const customer = await refetchCustomer(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ customer })
}
