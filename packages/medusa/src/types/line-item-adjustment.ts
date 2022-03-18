import { ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator, StringComparisonOperator } from "./common"

export class FilterableLineItemAdjustmentProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @ValidateNested()
  @IsType([String, [String]])
  item_id?: string | string[]

  @ValidateNested()
  @IsType([String, [String]])
  description?: string | string[]

  @ValidateNested()
  @IsType([String, [String]])
  resource_id?: string | string[]

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}
