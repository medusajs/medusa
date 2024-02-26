import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { CustomerAddressDTO, ICustomerModuleService } from "@medusajs/types"
import {
  deleteCustomerAddressesWorkflow,
  updateCustomerAddressesWorkflow,
} from "@medusajs/core-flows"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [address] = await customerModuleService.listAddresses(
    { id: req.params.address_id, customer_id: req.params.id },
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
    }
  )

  res.status(200).json({ address })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<Partial<CustomerAddressDTO>>,
  res: MedusaResponse
) => {
  const updateAddresses = updateCustomerAddressesWorkflow(req.scope)
  const { result, errors } = await updateAddresses.run({
    input: {
      selector: { id: req.params.address_id, customer_id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ address: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.address_id
  const deleteAddress = deleteCustomerAddressesWorkflow(req.scope)

  const { errors } = await deleteAddress.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "address",
    deleted: true,
  })
}
