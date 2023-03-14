import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../services"

/**
 * @oas [post] /orders/{id}/line-items/{line_item_id}/reserve
 * operationId: "PostOrdersOrderLineItemReservations"
 * summary: "Create a Reservation for a line item"
 * description: "Creates a Reservation for a line item at a specified location, optionally for a partial quantity."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (path) line_item_id=* {string} The ID of the Line item.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminOrdersOrderLineItemReservationReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createReservation(order_id, line_item_id, {
 *         location_id
 *       })
 *       .then(({ reservation }) => {
 *         console.log(reservation.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/line-items/{line_item_id}/reservations' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "location_id": "loc_1"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPostReservationsReq"
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
  const { id, line_item_id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminOrdersOrderLineItemReservationReq
  }
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const manager: EntityManager = req.scope.resolve("manager")

  const lineItemService: LineItemService = req.scope.resolve("lineItemService")

  const reservations = await manager.transaction(async (manager) => {
    const lineItem = await lineItemService
      .withTransaction(manager)
      .retrieve(line_item_id)

    if (!lineItem.variant_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Can't create a reservation for a Line Item wihtout a variant`
      )
    }

    const quantity = validatedBody.quantity || lineItem.quantity

    const productVariantInventoryServiceTx =
      productVariantInventoryService.withTransaction(manager)

    return await productVariantInventoryServiceTx.reserveQuantity(
      lineItem.variant_id,
      quantity,
      {
        locationId: validatedBody.location_id,
      }
    )
  })

  res.json({ reservation: reservations[0] })
}

/**
 * @schema AdminOrdersOrderLineItemReservationReq
 * type: object
 * required:
 * - location_id
 * properties:
 *   location_id:
 *     description: "The id of the location of the reservation"
 *     type: string
 *   quantity:
 *     description: "The quantity to reserve"
 *     type: number
 */
export class AdminOrdersOrderLineItemReservationReq {
  location_id: string

  quantity?: number
}
