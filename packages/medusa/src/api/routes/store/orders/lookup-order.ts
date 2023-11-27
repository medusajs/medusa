import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"

import { OrderService } from "../../../../services"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /store/orders
 * operationId: "GetOrders"
 * summary: "Look Up an Order"
 * description: "Look up an order using filters. If the filters don't narrow down the results to a single order, a 404 response is returned with no orders."
 * parameters:
 *   - (query) display_id=* {number} Filter by ID.
 *   - (query) fields {string} Comma-separated fields that should be expanded in the returned order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - in: query
 *     name: email
 *     style: form
 *     explode: false
 *     description: Filter by email.
 *     required: true
 *     schema:
 *       type: string
 *       format: email
 *   - in: query
 *     name: shipping_address
 *     style: form
 *     explode: false
 *     description: Filter by the shipping address's postal code.
 *     schema:
 *       type: object
 *       properties:
 *         postal_code:
 *           type: string
 *           description: The postal code of the shipping address
 * x-codegen:
 *   method: lookupOrder
 *   queryParams: StoreGetOrdersParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orders.lookupOrder({
 *         display_id: 1,
 *         email: "user@example.com"
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/orders?display_id=1&email=user@example.com'
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreOrdersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const validated = req.validatedQuery as StoreGetOrdersParams

  const orderService: OrderService = req.scope.resolve("orderService")

  const orders = await orderService.list(
    {
      display_id: validated.display_id,
      email: validated.email,
    },
    req.listConfig
  )

  if (orders.length !== 1) {
    res.sendStatus(404)
    return
  }

  const order = orders[0]

  res.json({
    order: cleanResponseData(order, req.allowedProperties || []),
  })
}

/**
 * Filters to apply on the order's shipping address.
 */
export class ShippingAddressPayload {
  /**
   * Postal code.
   */
  @IsOptional()
  @IsString()
  postal_code?: string
}

/**
 * Filters to narrow down the looked-up order, with configurations applied on the retrieved order.
 */
export class StoreGetOrdersParams extends FindParams {
  /**
   * Display ID of the order.
   */
  @IsNumber()
  @Type(() => Number)
  display_id: number

  /**
   * Email of the order.
   */
  @IsEmail()
  email: string

  /**
   * Filter the retrieved order by its shipping address details.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressPayload)
  shipping_address?: ShippingAddressPayload
}
