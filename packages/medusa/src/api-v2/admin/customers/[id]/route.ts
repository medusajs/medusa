import {
  deleteCustomersWorkflow,
  updateCustomersWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AdminCustomerResponse,
  CustomerUpdatableFields,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCustomerResponse>
) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const customer = await customerModuleService.retrieve(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.status(200).json({ customer })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CustomerUpdatableFields>,
  res: MedusaResponse<AdminCustomerResponse>
) => {
  const updateCustomers = updateCustomersWorkflow(req.scope)
  const { result, errors } = await updateCustomers.run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deleteCustomers = deleteCustomersWorkflow(req.scope)

  const { errors } = await deleteCustomers.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "customer",
    deleted: true,
  })
}
