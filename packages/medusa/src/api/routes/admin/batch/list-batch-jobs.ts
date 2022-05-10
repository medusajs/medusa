import { MedusaError } from "medusa-core-utils"
import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { pickBy, omit, identity } from "lodash"

import { defaultAdminBatchFields } from "."
import BatchJobService from "../../../../services/batch-job"
import { BatchJob } from "../../../../models"
import {
  FilterableBatchJobProps,
  BatchJobStatus,
} from "../../../../types/batch-job"
import { DateComparisonOperator } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { getListConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /batch
 * operationId: "GetBatch"
 * summary: "List Batch Jobs"
 * description: "Retrieve a list of Batch Jobs."
 * x-authenticated: true
 * parameters:
 *   - (query) limit {string} The number of collections to return.
 *   - (query) offset {string} The offset of collections to return.
 *   - (query) type {string | string[]} Filter by the batch type
 *   - (query) status {string} Filter by the status of the batch operation
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting collections was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting collections was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting collections was updated, i.e. less than, greater than etc.
 * tags:
 *   - Batch Job
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            batch_job:
 *              $ref: "#/components/schemas/batch_job"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetBatchParams, req.query)

  const batchService: BatchJobService = req.scope.resolve("batchJobService")

  let includeFields: (keyof BatchJob)[] | undefined
  if (validated.fields) {
    includeFields = validated.fields.split(",") as (keyof BatchJob)[]
  }

  let expandFields: string[] | undefined
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (typeof validated.order !== "undefined") {
    if (validated.order.startsWith("-")) {
      const [, field] = validated.order.split("-")
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [validated.order]: "ASC" }
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order field must be a valid BatchJob field"
    )
  }

  const listConfig = getListConfig<BatchJob>(
    defaultAdminBatchFields as (keyof BatchJob)[],
    [],
    includeFields,
    expandFields,
    validated.limit,
    validated.offset,
    orderBy
  )

  const filterableFields: FilterableBatchJobProps = omit(validated, [
    "limit",
    "offset",
    "order",
    "expand",
    "fields",
  ])

  filterableFields.created_by = req.user.id

  const [jobs, count] = await batchService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  res.status(200).json({
    batch_jobs: jobs,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetBatchPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  order?: string
}

export class AdminGetBatchParams extends AdminGetBatchPaginationParams {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsEnum(BatchJobStatus, { each: true })
  status?: BatchJobStatus[]

  @IsArray()
  @IsOptional()
  type?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
