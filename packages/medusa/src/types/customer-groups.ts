import { IsString } from "class-validator"
import { ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"

import { StringComparisonOperator } from "./common"

export type CustomerBatchIds = {
  id: string
}
export class CustomerGroupsBatchCustomer {
  @IsString()
  id: string
}
export class FilterableCustomerGroupProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator
}
