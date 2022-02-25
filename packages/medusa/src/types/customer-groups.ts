import { IsString, ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"

import { StringComparisonOperator } from "./common"

export class FilterableCustomerGroupProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator
}

export class CustomerGroupsBatchCustomer {
  @IsString()
  id: string
}
export class CustomerGroupUpdate {
  name?: string
  metadata?: object
}
