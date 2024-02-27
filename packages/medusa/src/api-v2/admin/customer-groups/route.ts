import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { CreateCustomerGroupDTO, ICustomerModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createCustomerGroupsWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [groups, count] =
    await customerModuleService.listAndCountCustomerGroups(
      req.filterableFields,
      req.listConfig
    )

  const { offset, limit } = req.validatedQuery

  res.json({
    count,
    customer_groups: groups,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCustomerGroupDTO>,
  res: MedusaResponse
) => {
  const createGroups = createCustomerGroupsWorkflow(req.scope)
  const customersData = [
    {
      ...req.validatedBody,
      created_by: req.auth.actor_id,
    },
  ]

  const { result, errors } = await createGroups.run({
    input: { customersData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer_group: result[0] })
}
