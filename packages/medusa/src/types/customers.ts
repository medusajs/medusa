import { IsOptional, IsString } from "class-validator"

export class Selector {
  @IsString()
  @IsOptional()
  q?: string
}
