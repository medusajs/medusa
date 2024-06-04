import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { createCustomerAddressesWorkflow } from "@medusajs/core-flows"
import {
  StoreCreateCustomerAddressType,
  StoreGetCustomerAddressesParamsType,
} from "../../validators"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { refetchCustomer } from "../../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerAddressesParamsType>,
  res: MedusaResponse
) => {
  const customerId = req.auth_context.actor_id

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer_address",
    variables: {
      filters: { ...req.filterableFields, customer_id: customerId },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: addresses, metadata } = await remoteQuery(queryObject)

  res.json({
    addresses,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreateCustomerAddressType>,
  res: MedusaResponse
) => {
  const customerId = req.auth_context.actor_id

  const createAddresses = createCustomerAddressesWorkflow(req.scope)
  const addresses = [
    {
      ...req.validatedBody,
      customer_id: customerId,
    },
  ]

  await createAddresses.run({
    input: { addresses },
  })

  const customer = await refetchCustomer(
    customerId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}
