import { CustomerAddressDTO, ICustomerModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"
import {
  deleteCustomerAddressesWorkflow,
  updateCustomerAddressesWorkflow,
} from "@medusajs/core-flows"

import { MedusaError } from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.auth?.actor_id

  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [address] = await customerModuleService.listAddresses(
    { id: req.params.address_id, customer_id: id },
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
    }
  )

  res.status(200).json({ address })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.auth!.actor_id!
  const service = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  await validateCustomerAddress(service, id, req.params.address_id)

  const updateAddresses = updateCustomerAddressesWorkflow(req.scope)
  const { result, errors } = await updateAddresses.run({
    input: {
      selector: { id: req.params.address_id, customer_id: req.params.id },
      update: req.validatedBody as Partial<CustomerAddressDTO>,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ address: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.auth!.actor_id

  const service = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  await validateCustomerAddress(service, id, req.params.address_id)
  const deleteAddress = deleteCustomerAddressesWorkflow(req.scope)

  const { errors } = await deleteAddress.run({
    input: { ids: [req.params.address_id] },
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

const validateCustomerAddress = async (
  customerModuleService: ICustomerModuleService,
  customerId: string,
  addressId: string
) => {
  const [address] = await customerModuleService.listAddresses(
    { id: addressId, customer_id: customerId },
    { select: ["id"] }
  )

  if (!address) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Address with id: ${addressId} was not found`
    )
  }
}
