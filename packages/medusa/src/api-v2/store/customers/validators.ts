import { IsEmail, IsOptional, IsString } from "class-validator"

export class StorePostCustomersReq {
  @IsString()
  @IsOptional()
  first_name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone?: string
}
