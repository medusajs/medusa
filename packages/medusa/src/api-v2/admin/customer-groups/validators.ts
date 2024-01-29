import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class AdminGetCustomerGroupsGroupParams extends FindParams {}

class FilterableCustomerPropsValidator {
  @IsOptional()
  @IsString({ each: true })
  id?: string | string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OperatorMapValidator)
  email?: string | string[] | OperatorMap<string>

  @IsOptional()
  @IsString({ each: true })
  default_billing_address_id?: string | string[] | null

  @IsOptional()
  @IsString({ each: true })
  default_shipping_address_id?: string | string[] | null

  @IsOptional()
  @IsString({ each: true })
  company_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  first_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  last_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  created_by?: string | string[] | null

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>
}

export class AdminGetCustomerGroupsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsOptional()
  @IsString({ each: true })
  id?: string | string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OperatorMapValidator)
  name?: string | OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterableCustomerPropsValidator)
  customers?: FilterableCustomerPropsValidator | string | string[]

  @IsOptional()
  @IsString({ each: true })
  created_by?: string | string[] | null

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCustomerGroupsParams)
  $and?: AdminGetCustomerGroupsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCustomerGroupsParams)
  $or?: AdminGetCustomerGroupsParams[]
}

export class AdminPostCustomerGroupsReq {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class AdminPostCustomerGroupsGroupReq {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string
}
