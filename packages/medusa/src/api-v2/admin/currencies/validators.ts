import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class AdminGetCurrenciesCurrencyParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved currencies.
 */
export class AdminGetCurrenciesParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * Search parameter for currencies.
   */
  @IsString({ each: true })
  @IsOptional()
  code?: string | string[]

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCurrenciesParams)
  $and?: AdminGetCurrenciesParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCurrenciesParams)
  $or?: AdminGetCurrenciesParams[]
}
