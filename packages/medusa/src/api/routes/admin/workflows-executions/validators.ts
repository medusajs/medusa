import { TransactionHandlerType } from "@medusajs/utils"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../../types/common"
import { IsType } from "../../../../utils"

export class AdminGetWorkflowExecutionDetailsParams extends FindParams {}

export class AdminGetWorkflowExecutionsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  /**
   * transaction id(s) to filter workflow executions by transaction_id.
   */
  @IsOptional()
  @IsType([String, [String]])
  transaction_id?: string | string[]

  /**
   * workflow id(s) to filter workflow executions by workflow_id
   */
  @IsOptional()
  @IsType([String, [String]])
  workflow_id?: string | string[]
}

export class AdminPostWorkflowsRunReq {
  @IsOptional()
  input?: unknown

  @IsOptional()
  @IsString()
  transaction_id?: string
}

export class AdminPostWorkflowsAsyncResponseReq {
  @IsString()
  transaction_id: string

  @IsString()
  step_id: string

  @IsOptional()
  response?: unknown

  @IsOptional()
  compensate_input?: unknown

  @IsOptional()
  @Transform(({ value }) => (value + "").toLowerCase())
  @IsEnum(TransactionHandlerType)
  action?: TransactionHandlerType
}
