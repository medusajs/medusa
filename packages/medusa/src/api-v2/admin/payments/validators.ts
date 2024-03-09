import { Type } from "class-transformer"
import { IsInt, IsOptional, ValidateNested } from "class-validator"
import {
  DateComparisonOperator,
  FindParams,
  extendedFindParamsMixin,
} from "../../../types/common"
import { IsType } from "../../../utils"

export class AdminGetPaymentsPaymentParams extends FindParams {}

export class AdminGetPaymentsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * IDs to filter users by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Date filters to apply on the users' `update_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customer users' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the users' `deleted_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}

export class AdminPostPaymentsCapturesReq {
  @IsInt()
  @IsOptional()
  amount?: number
}

export class AdminPostPaymentsRefundsReq {
  @IsInt()
  @IsOptional()
  amount?: number
}
