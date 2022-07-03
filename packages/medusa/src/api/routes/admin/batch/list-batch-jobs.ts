import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"
import { pickBy } from "lodash"
import BatchJobService from "../../../../services/batch-job"
import { DateComparisonOperator } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { Request } from "express"

/**
 * @oas [get] /batch-jobs
 * operationId: "GetBatchJobs"
 * summary: "List Batch Jobs"
 * description: "Retrieve a list of Batch Jobs."
 * x-authenticated: true
 * parameters:
 *   - (query) limit {string} The number of collections to return.
 *   - (query) offset {string} The offset of collections to return.
 *   - (query) type {string | string[]} Filter by the batch type
 *   - (query) confirmed_at {DateComparisonOperator | null} Date comparison for when resulting collections was confirmed, i.e. less than, greater than etc.
 *   - (query) pre_processed_at {DateComparisonOperator | null} Date comparison for when resulting collections was pre processed, i.e. less than, greater than etc.
 *   - (query) completed_at {DateComparisonOperator | null} Date comparison for when resulting collections was completed, i.e. less than, greater than etc.
 *   - (query) failed_at {DateComparisonOperator | null} Date comparison for when resulting collections was failed, i.e. less than, greater than etc.
 *   - (query) canceled_at {DateComparisonOperator | null} Date comparison for when resulting collections was canceled, i.e. less than, greater than etc.
 *   - (query) order {string} Order used when retrieving batch jobs
 *   - (query) expand[] {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields[] {string} (Comma separated) Which fields should be included in each order of the result.
 *   - (query) deleted_at {DateComparisonOperator | null} Date comparison for when resulting collections was deleted, i.e. less than, greater than etc.
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
export default async (req: Request, res) => {
  const batchService: BatchJobService = req.scope.resolve("batchJobService")

  const created_by = req.user?.id || req.user?.userId

  const [jobs, count] = await batchService.listAndCount(
    pickBy(
      { created_by, ...(req.filterableFields ?? {}) },
      (val) => typeof val !== "undefined"
    ),
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery
  res.status(200).json({
    batch_jobs: jobs,
    count,
    offset,
    limit,
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

  @IsArray()
  @IsOptional()
  type?: string[]

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  confirmed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  pre_processed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  completed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  failed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator | null

  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  @IsOptional()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
