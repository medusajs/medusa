import { IsEmail, IsObject, IsOptional, IsString } from "class-validator";

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
