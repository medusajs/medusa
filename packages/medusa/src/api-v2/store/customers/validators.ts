import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { extendedFindParamsMixin, FindParams } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class StoreGetCustomersMeParams extends FindParams {}

export class StorePostCustomersReq {
  @IsString()
  @IsOptional()
  first_name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  company_name?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class StorePostCustomersMeAddressesReq {
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

export class StorePostCustomersMeAddressesAddressReq {
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

export class StoreGetCustomersMeAddressesParams extends extendedFindParamsMixin(
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
