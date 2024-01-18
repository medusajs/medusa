import { createPromotionsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreatePromotionDTO, IPromotionModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const [promotions, count] = await promotionModuleService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    promotions,
    offset,
    limit,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const createPromotions = createPromotionsWorkflow(req.scope)
  const manager = req.scope.resolve("manager")
  const promotionsData = [req.validatedBody as CreatePromotionDTO]

  const { result } = await createPromotions.run({
    input: { promotionsData },
    context: { manager },
  })

  res.status(200).json({ promotion: result[0] })
}
