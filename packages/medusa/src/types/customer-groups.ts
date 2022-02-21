import { ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"

import { DateComparisonOperator, StringComparisonOperator } from "./common"

export class FilterableCustomerGroupProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  name?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}
