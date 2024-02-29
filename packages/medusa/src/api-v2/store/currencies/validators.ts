import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class StoreGetCurrenciesCurrencyParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved currencies.
 */
export class StoreGetCurrenciesParams extends extendedFindParamsMixin({
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
  @Type(() => StoreGetCurrenciesParams)
  $and?: StoreGetCurrenciesParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StoreGetCurrenciesParams)
  $or?: StoreGetCurrenciesParams[]
}
