import { IsOptional, IsString } from "class-validator"

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: "ASC" | "DESC"
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

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
