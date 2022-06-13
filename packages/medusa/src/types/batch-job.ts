import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator } from "./common"

export enum BatchJobStatus {
  CREATED = "created",
  PROCESSING = "processing",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed",
}

export class FilterableBatchJobProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsEnum(BatchJobStatus, { each: true })
  status?: BatchJobStatus[]

  @IsArray()
  @IsOptional()
  type?: string[]

  @IsString()
  @IsOptional()
  @IsType([String, [String]])
  created_by?: string | string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
