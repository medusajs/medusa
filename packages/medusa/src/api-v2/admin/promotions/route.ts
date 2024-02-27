import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { CreatePromotionDTO, IPromotionModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createPromotionsWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
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

export const POST = async (
  req: AuthenticatedMedusaRequest<CreatePromotionDTO>,
  res: MedusaResponse
) => {
  const createPromotions = createPromotionsWorkflow(req.scope)
  const promotionsData = [req.validatedBody]

  const { result, errors } = await createPromotions.run({
    input: { promotionsData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ promotion: result[0] })
}
