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
import { BatchJobStatus } from "../../../../types/batch-job"
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
 *   - (query) order {string} Order used when retrieving batch jobs
 *   - (query) expand[] {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields[] {string} (Comma separated) Which fields should be included in each order of the result.
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
  const { fields, expand, order, limit, offset, ...filterableFields } =
    await validator(AdminGetBatchParams, req.query)

  const batchService: BatchJobService = req.scope.resolve("batchJobService")

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (typeof order !== "undefined") {
    if (order.startsWith("-")) {
      const [, field] = order.split("-")
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [order]: "ASC" }
    }
  }

  const listConfig = getListConfig<BatchJob>(
    defaultAdminBatchFields as (keyof BatchJob)[],
    [],
    fields?.split(",") as (keyof BatchJob)[],
    expand?.split(","),
    limit,
    offset,
    orderBy
  )

  const created_by: string = req.user.id || req.user.userId

  const [jobs, count] = await batchService.listAndCount(
    pickBy(
      { created_by, ...filterableFields },
      (val) => typeof val !== "undefined"
    ),
    listConfig
  )

  res.status(200).json({
    batch_jobs: jobs,
    count,
    offset: offset,
    limit: limit,
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
  @IsArray()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsArray()
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
