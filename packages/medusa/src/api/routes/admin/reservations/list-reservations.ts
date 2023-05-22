import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator"
import {
  NumericalComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { IInventoryService } from "@medusajs/types"
import { IsType } from "../../../../utils/validators/is-type"
import { LineItemService } from "../../../../services"
import { Type } from "class-transformer"
import { joinInventoryItems } from "./utils/join-inventory-items"
import { joinLineItems } from "./utils/join-line-items"

/**
 * @oas [get] /admin/reservations
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
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetReservationsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.reservations.list()
 *       .then(({ reservations, count, limit, offset }) => {
 *         console.log(reservations.length)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-categories' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Reservations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReservationsListRes"
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
  const manager: EntityManager = req.scope.resolve("manager")

  const { filterableFields, listConfig } = req

  const relations = new Set(listConfig.relations ?? [])

  const includeItems = relations.delete("line_item")
  const includeInventoryItems = relations.delete("inventory_item")

  if (listConfig.relations?.length) {
    listConfig.relations = [...relations]
  }

  const [reservations, count] = await inventoryService.listReservationItems(
    filterableFields,
    listConfig,
    {
      transactionManager: manager,
    }
  )

  const promises: Promise<any>[] = []

  if (includeInventoryItems) {
    promises.push(
      joinInventoryItems(reservations, {
        inventoryService,
        manager,
      })
    )
  }

  if (includeItems) {
    const lineItemService: LineItemService =
      req.scope.resolve("lineItemService")

    promises.push(joinLineItems(reservations, lineItemService))
  }

  await Promise.all(promises)

  const { limit, offset } = req.validatedQuery

  res.json({ reservations, count, limit, offset })
}

export class AdminGetReservationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

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
