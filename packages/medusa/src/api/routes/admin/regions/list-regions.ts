import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import RegionService from "../../../../services/region"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"

/**
 * @oas [get] /admin/regions
 * operationId: "GetRegions"
 * summary: "List Regions"
 * description: "Retrieve a list of Regions. The regions can be filtered by fields such as `created_at`. The regions can also be paginated."
 * x-authenticated: true
 * parameters:
 *  - (query) q {string} Term used to search regions' name.
 *  - (query) order {string} A field to sort-order the retrieved regions by.
 *  - in: query
 *    name: limit
 *    schema:
 *      type: integer
 *      default: 50
 *    required: false
 *    description: Limit the number of regions returned.
 *  - in: query
 *    name: offset
 *    schema:
 *      type: integer
 *      default: 0
 *    required: false
 *    description: The number of regions to skip when retrieving the regions.
 *  - in: query
 *    name: created_at
 *    required: false
 *    description: Filter by a creation date range.
 *    schema:
 *      type: object
 *      properties:
 *        lt:
 *          type: string
 *          description: filter by dates less than this date
 *          format: date
 *        gt:
 *          type: string
 *          description: filter by dates greater than this date
 *          format: date
 *        lte:
 *          type: string
 *          description: filter by dates less than or equal to this date
 *          format: date
 *        gte:
 *          type: string
 *          description: filter by dates greater than or equal to this date
 *          format: date
 *  - in: query
 *    name: updated_at
 *    required: false
 *    description: Filter by an update date range.
 *    schema:
 *      type: object
 *      properties:
 *        lt:
 *          type: string
 *          description: filter by dates less than this date
 *          format: date
 *        gt:
 *          type: string
 *          description: filter by dates greater than this date
 *          format: date
 *        lte:
 *          type: string
 *          description: filter by dates less than or equal to this date
 *          format: date
 *        gte:
 *          type: string
 *          description: filter by dates greater than or equal to this date
 *          format: date
 *  - in: query
 *    name: deleted_at
 *    required: false
 *    description: Filter by a deletion date range.
 *    schema:
 *      type: object
 *      properties:
 *        lt:
 *          type: string
 *          description: filter by dates less than this date
 *          format: date
 *        gt:
 *          type: string
 *          description: filter by dates greater than this date
 *          format: date
 *        lte:
 *          type: string
 *          description: filter by dates less than or equal to this date
 *          format: date
 *        gte:
 *          type: string
 *          description: filter by dates greater than or equal to this date
 *          format: date
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetRegionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.list()
 *       .then(({ regions, limit, offset, count }) => {
 *         console.log(regions.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminRegions } from "medusa-react"
 *
 *       const Regions = () => {
 *         const { regions, isLoading } = useAdminRegions()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {regions && !regions.length && <span>No Regions</span>}
 *             {regions && regions.length > 0 && (
 *               <ul>
 *                 {regions.map((region) => (
 *                   <li key={region.id}>{region.name}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Regions
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/regions' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Regions
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRegionsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const regionService: RegionService = req.scope.resolve("regionService")
  const { limit, offset } = req.validatedQuery

  const [regions, count] = await regionService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  res.json({
    regions,
    count,
    offset,
    limit,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved regions.
 */
export class AdminGetRegionsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * Search parameter for regions.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Date filters to apply on the regions' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the regions' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the regions' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}
