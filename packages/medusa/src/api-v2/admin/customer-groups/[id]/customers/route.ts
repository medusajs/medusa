import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const service = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [customers, count] = await service.listAndCount(
    { ...req.filterableFields, groups: id },
    req.listConfig
  )

  const { offset, limit } = req.validatedQuery

  res.json({
    count,
    customers,
    offset,
    limit,
  })
}
