import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

export class OperatorMapValidator {
  @IsOptional()
  @IsString()
  $eq?: string | string[]

  @IsOptional()
  @IsString()
  $ne?: string

  @IsOptional()
  @IsArray()
  $in?: string[]

  @IsOptional()
  @IsArray()
  $nin?: string[]

  @IsOptional()
  @IsString()
  $like?: string

  @IsOptional()
  @IsString()
  $re?: string

  @IsOptional()
  @IsString()
  $ilike?: string

  @IsOptional()
  @IsString()
  $fulltext?: string

  @IsOptional()
  @IsArray()
  $overlap?: string[]

  @IsOptional()
  @IsString()
  $contains?: string

  @IsOptional()
  @IsArray()
  $contained?: string[]

  @IsOptional()
  @IsBoolean()
  $exists?: boolean

  @IsOptional()
  @IsString()
  $gt?: string

  @IsOptional()
  @IsString()
  $gte?: string

  @IsOptional()
  @IsString()
  $lt?: string

  @IsOptional()
  @IsString()
  $lte?: string
}
