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
import { BatchJob } from "../models"

export enum BatchJobStatus {
  CREATED = "created",
  PRE_PROCESSED = "pre_processed",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELED = "canceled",
  FAILED = "failed",
}

export type BatchJobUpdateProps = Partial<Pick<BatchJob, "context" | "result">>

export type CreateBatchJobInput = {
  type: string
  context: BatchJob["context"]
  dry_run: boolean
}

export type BatchJobResultError = {
  message: string
  code: string | number
  [key: string]: unknown
}

export type BatchJobResultStatDescriptor = {
  key: string
  name: string
  message: string
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

export type BatchJobCreateProps = Pick<
  BatchJob,
  "context" | "type" | "created_by" | "dry_run"
>
