import { createCustomerAddressesWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateCustomerAddressDTO,
  ICustomerModuleService,
} from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = req.params.id
  const createAddresses = createCustomerAddressesWorkflow(req.scope)
  const addresses = [
    {
      ...(req.validatedBody as CreateCustomerAddressDTO),
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
