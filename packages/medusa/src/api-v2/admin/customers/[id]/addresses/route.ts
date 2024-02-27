import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  CreateCustomerAddressDTO,
  ICustomerModuleService,
} from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createCustomerAddressesWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.params.id

  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [addresses, count] = await customerModuleService.listAndCountAddresses(
    { ...req.filterableFields, customer_id: customerId },
    req.listConfig
  )

  const { offset, limit } = req.validatedQuery

  res.json({
    count,
    addresses,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCustomerAddressDTO>,
  res: MedusaResponse
) => {
  const customerId = req.params.id
  const createAddresses = createCustomerAddressesWorkflow(req.scope)
  const addresses = [
    {
      ...req.validatedBody,
      customer_id: customerId,
    },
  ]

  const { result, errors } = await createAddresses.run({
    input: { addresses },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ address: result[0] })
}
