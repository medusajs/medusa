import { Transform, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator"
import "reflect-metadata"
import { transformDate } from "../utils/validators/date-transform"

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export type TotalField =
  | "shipping_total"
  | "discount_total"
  | "tax_total"
  | "refunded_total"
  | "total"
  | "subtotal"
  | "refundable_amount"
  | "gift_card_total"

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [k: symbol]: "ASC" | "DESC" }
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export type DeleteResponse = {
  id: string
  object: string
  deleted: boolean
}

export class DateComparisonOperator {
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lt?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gt?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gte?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lte?: Date
}

export class StringComparisonOperator {
  @IsString()
  @IsOptional()
  lt?: string

  @IsString()
  @IsOptional()
  gt?: string

  @IsString()
  @IsOptional()
  gte?: string

  @IsString()
  @IsOptional()
  lte?: string
}

export class NumericalComparisonOperator {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lt?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gt?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gte?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lte?: number
}

export class AddressPayload {
  @IsOptional()
  @IsString()
  first_name: string

  @IsOptional()
  @IsString()
  last_name: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  metadata: object

  @IsOptional()
  @IsString()
  company: string

  @IsOptional()
  @IsString()
  address_1: string

  @IsOptional()
  @IsString()
  address_2: string

  @IsOptional()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  country_code: string

  @IsOptional()
  @IsString()
  province: string

  @IsOptional()
  @IsString()
  postal_code: string
}

export class AddressCreatePayload {
  @IsString()
  first_name: string
  @IsString()
  last_name: string
  @IsOptional()
  @IsString()
  phone: string
  @IsOptional()
  metadata: object
  @IsOptional()
  @IsString()
  company: string
  @IsString()
  address_1: string
  @IsOptional()
  @IsString()
  address_2: string
  @IsString()
  city: string
  @IsString()
  country_code: string
  @IsOptional()
  @IsString()
  province: string
  @IsString()
  postal_code: string
}

export class FindParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
