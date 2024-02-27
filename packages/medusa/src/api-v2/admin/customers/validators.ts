import { OperatorMap } from "@medusajs/types"
import { Transform, Type } from "class-transformer"
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"
import { IsType } from "../../../utils"

export class AdminGetCustomersCustomerParams extends FindParams {}

export class AdminGetCustomersParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsOptional()
  @IsString({ each: true })
  id?: string | string[]

  @IsOptional()
  @IsType([String, [String], OperatorMapValidator])
  email?: string | string[] | OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterableCustomerGroupPropsValidator)
  groups?: FilterableCustomerGroupPropsValidator | string | string[]

  @IsOptional()
  @IsString({ each: true })
  company_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  first_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsType([String, [String], OperatorMapValidator])
  @Transform(({ value }) => (value === "null" ? null : value))
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

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCustomersParams)
  $and?: AdminGetCustomersParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCustomersParams)
  $or?: AdminGetCustomersParams[]
}

class FilterableCustomerGroupPropsValidator {
  @IsOptional()
  @IsString({ each: true })
  id?: string | string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OperatorMapValidator)
  name?: string | OperatorMap<string>

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

export class AdminPostCustomersReq {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  company_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  first_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone?: string
}

export class AdminPostCustomersCustomerReq {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  company_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  first_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone?: string
}

export class AdminPostCustomersCustomerAddressesReq {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_name?: string

  @IsBoolean()
  @IsOptional()
  is_default_shipping?: boolean

  @IsBoolean()
  @IsOptional()
  is_default_billing?: boolean

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  company?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  first_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_1?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_2?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  city?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  country_code?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  province?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  postal_code?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostCustomersCustomerAddressesAddressReq {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_name?: string

  @IsBoolean()
  @IsOptional()
  is_default_shipping?: boolean

  @IsBoolean()
  @IsOptional()
  is_default_billing?: boolean

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  company?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  first_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_1?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address_2?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  city?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  country_code?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  province?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  postal_code?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone?: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminGetCustomersCustomerAddressesParams extends extendedFindParamsMixin(
  {
    limit: 100,
    offset: 0,
  }
) {
  @IsOptional()
  @IsString({ each: true })
  address_name?: string | string[] | OperatorMap<string>

  @IsOptional()
  @IsBoolean()
  is_default_shipping?: boolean

  @IsOptional()
  @IsBoolean()
  is_default_billing?: boolean

  @IsOptional()
  @IsString({ each: true })
  company?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  first_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  last_name?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  address_1?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  address_2?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  city?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  country_code?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  province?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  postal_code?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @IsString({ each: true })
  phone?: string | string[] | OperatorMap<string> | null

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  metadata?: OperatorMap<Record<string, unknown>>
}
