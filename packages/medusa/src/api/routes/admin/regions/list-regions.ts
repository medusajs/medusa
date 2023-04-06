import { IsInt, IsOptional, ValidateNested } from "class-validator"
import _, { identity } from "lodash"
import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { DateComparisonOperator } from "../../../../types/common"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/regions
 * operationId: "GetRegions"
 * summary: "List Regions"
 * description: "Retrieves a list of Regions."
 * x-authenticated: true
 * parameters:
 *  - in: query
 *    name: limit
 *    schema:
 *      type: integer
 *      default: 50
 *    required: false
 *    description: limit the number of regions in response
 *  - in: query
 *    name: offset
 *    schema:
 *      type: integer
 *      default: 0
 *    required: false
 *    description: Offset of regions in response (used for pagination)
 *  - in: query
 *    name: created_at
 *    schema:
 *      type: object
 *    required: false
 *    description: Date comparison for when resulting region was created, i.e. less than, greater than etc.
 *  - in: query
 *    name: updated_at
 *    schema:
 *      type: object
 *    required: false
 *    description: Date comparison for when resulting region was updated, i.e. less than, greater than etc.
 *  - in: query
 *    name: deleted_at
 *    schema:
 *      type: object
 *    required: false
 *    description: Date comparison for when resulting region was deleted, i.e. less than, greater than etc.
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/regions' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const validated = await validator(AdminGetRegionsParams, req.query)

  const regionService: RegionService = req.scope.resolve("regionService")

  const filterableFields = _.omit(validated, ["limit", "offset"])

  const listConfig = {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const regions: Region[] = await regionService.list(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.json({
    regions,
    count: regions.length,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetRegionsPaginationParams {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}

export class AdminGetRegionsParams extends AdminGetRegionsPaginationParams {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}
