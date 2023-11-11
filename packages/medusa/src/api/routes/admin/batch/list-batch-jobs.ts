import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { Transform, Type } from "class-transformer"

import BatchJobService from "../../../../services/batch-job"
import { DateComparisonOperator } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { Request } from "express"
import { pickBy } from "lodash"
import { isDefined } from "medusa-core-utils"

/**
 * @oas [get] /admin/batch-jobs
 * operationId: "GetBatchJobs"
 * summary: "List Batch Jobs"
 * description: "Retrieve a list of Batch Jobs. The batch jobs can be filtered by fields such as `type` or `confirmed_at`. The batch jobs can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} Limit the number of batch jobs returned.
 *   - (query) offset=0 {integer} The number of batch jobs to skip when retrieving the batch jobs.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by the batch ID
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: batch job ID
 *         - type: array
 *           description: multiple batch job IDs
 *           items:
 *             type: string
 *   - in: query
 *     name: type
 *     style: form
 *     explode: false
 *     description: Filter by the batch type
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: confirmed_at
 *     style: form
 *     explode: false
 *     description: Filter by a confirmation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: pre_processed_at
 *     style: form
 *     explode: false
 *     description: Filter by a pre-processing date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: completed_at
 *     style: form
 *     explode: false
 *     description: Filter by a completion date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: failed_at
 *     style: form
 *     explode: false
 *     description: Filter by a failure date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: canceled_at
 *     style: form
 *     explode: false
 *     description: Filter by a cancelation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) order {string} A batch-job field to sort-order the retrieved batch jobs by.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned batch jobs.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned batch jobs.
 *   - in: query
 *     name: created_at
 *     style: form
 *     explode: false
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     style: form
 *     explode: false
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetBatchParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.batchJobs.list()
 *       .then(({ batch_jobs, limit, offset, count }) => {
 *         console.log(batch_jobs.length)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/batch-jobs' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Batch Jobs
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminBatchJobListRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res) => {
  const batchService: BatchJobService = req.scope.resolve("batchJobService")

  const created_by = req.user?.id || req.user?.userId

  const [jobs, count] = await batchService.listAndCount(
    pickBy({ created_by, ...(req.filterableFields ?? {}) }, (val) =>
      isDefined(val)
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

/**
 * Request parameters used to configure and paginate retrieved batch jobs.
 */
export class AdminGetBatchPaginationParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  /**
   * {@inheritDoc FindPaginationParams.offset}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsString()
  @IsOptional()
  fields?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string
}

/**
 * Parameters used to filter and configure pagination of the retrieved batch jobs.
 */
export class AdminGetBatchParams extends AdminGetBatchPaginationParams {
  /**
   * IDs to filter batch jobs by.
   */
  @IsOptional()
  @IsArray()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Types to filter batch jobs by.
   */
  @IsArray()
  @IsOptional()
  type?: string[]

  /**
   * Date filters to apply on the batch jobs' `confirmed_at` date.
   */
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  @Type(() => DateComparisonOperator)
  confirmed_at?: DateComparisonOperator | null

  /**
   * Date filters to apply on the batch jobs' `pre_processed_at` date.
   */
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  @Type(() => DateComparisonOperator)
  pre_processed_at?: DateComparisonOperator | null

  /**
   * Date filters to apply on the batch jobs' `completed_at` date.
   */
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  @Type(() => DateComparisonOperator)
  completed_at?: DateComparisonOperator | null

  /**
   * Date filters to apply on the batch jobs' `failed_at` date.
   */
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  @Type(() => DateComparisonOperator)
  failed_at?: DateComparisonOperator | null

  /**
   * Date filters to apply on the batch jobs' `canceled_at` date.
   */
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator | null

  /**
   * Date filters to apply on the batch jobs' `created_at` date.
   */
  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the batch jobs' `updated_at` date.
   */
  @IsOptional()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
