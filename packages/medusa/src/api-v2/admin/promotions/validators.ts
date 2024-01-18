import { IsOptional, IsString } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class AdminGetPromotionsPromotionParams extends FindParams {}

export class AdminGetPromotionsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  code?: string
}
