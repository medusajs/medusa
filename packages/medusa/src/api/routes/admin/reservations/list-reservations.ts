import { Type } from "class-transformer"
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"
import { IInventoryService } from "../../../../interfaces"
import {
  extendedFindParamsMixin,
  NumericalComparisonOperator,
} from "../../../../types/common"

/**
 * @oas [get] /reservations
 * operationId: "GetReservations"
 * summary: "List Reservations"
 * description: "Retrieve a list of Reservations."
 * x-authenticated: true
 * parameters:
 *   - in: query
 *     name: location_id
 *     style: form
 *     explode: false
 *     description: Location ids to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: inventory_item_id
 *     style: form
 *     explode: false
 *     description: Inventory Item ids to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: line_item_id
 *     style: form
 *     explode: false
 *     description: Line Item ids to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: quantity
 *     description: Filter by reservation quantity
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *           type: number
 *           description: filter by reservation quantity less than this number
 *         gt:
 *           type: number
 *           description: filter by reservation quantity greater than this number
 *         lte:
 *           type: number
 *           description: filter by reservation quantity less than or equal to this number
 *         gte:
 *           type: number
 *           description: filter by reservation quantity greater than or equal to this number
 *   - (query) offset=0 {integer} How many Reservations to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of Reservations returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the product category.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the product category.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-categories' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Category
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminGetReservationReservationsReq"
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
export default async (req: Request, res: Response) => {
  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const [reservations, count] = await inventoryService.listReservationItems(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({ reservations, count, limit, offset })
}

export class AdminGetReservationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  location_id?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inventory_item_id?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  line_item_id?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => NumericalComparisonOperator)
  quantity?: NumericalComparisonOperator
}
