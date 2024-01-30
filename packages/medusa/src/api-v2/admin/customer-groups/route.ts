import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICustomerModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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
    groups,
    offset,
    limit,
  })
}
