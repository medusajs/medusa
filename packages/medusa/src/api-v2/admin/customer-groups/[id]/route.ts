import {
  updateCustomerGroupsWorkflow,
  deleteCustomerGroupsWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CustomerGroupUpdatableFields,
  ICustomerModuleService,
} from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const group = await customerModuleService.retrieveCustomerGroup(
    req.params.id,
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
    }
  )

  res.status(200).json({ customer_group: group })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const updateGroups = updateCustomerGroupsWorkflow(req.scope)
  const { result, errors } = await updateGroups.run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as CustomerGroupUpdatableFields,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer_group: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id
  const deleteCustomerGroups = deleteCustomerGroupsWorkflow(req.scope)

  const { errors } = await deleteCustomerGroups.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "customer_group",
    deleted: true,
  })
}
