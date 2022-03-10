import { IsOptional, IsString } from "class-validator"

export class AdminListCustomerSelector {
  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsString({ each: true })
  groups?: string[]
}
