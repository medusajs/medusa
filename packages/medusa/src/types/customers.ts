import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString } from "class-validator"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"
import { AddressPayload } from "./common"

export class AdminListCustomerSelector {
  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  has_account?: boolean

  @IsOptional()
  @IsString({ each: true })
  groups?: string[]
}

export type CreateCustomerInput = {
  email: string
  password?: string
  password_hash?: string
  has_account?: boolean

  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export type UpdateCustomerInput = {
  password?: string
  metadata?: Record<string, unknown>
  billing_address?: AddressPayload | string
  billing_address_id?: string
  groups?: { id: string }[]

  email?: string
  first_name?: string
  last_name?: string
  phone?: string
}
