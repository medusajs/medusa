import { IsOptional, IsString } from "class-validator"

export class AdminListCustomerSelector {
  @IsString()
  @IsOptional()
  q?: string
}
