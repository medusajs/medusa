import { IPromotionModuleService } from "@medusajs/types"
import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { extendedFindParamsMixin } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    "promotionModuleService"
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

export class AdminGetPromotionsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  code?: string
}
