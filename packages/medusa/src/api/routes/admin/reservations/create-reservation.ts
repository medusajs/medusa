import { IsNumber, IsObject, IsOptional, IsString } from "class-validator"

import { IInventoryService } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import { validateUpdateReservationQuantity } from "./utils/validate-reservation-quantity"

/**
 * @oas [post] /admin/reservations
 * operationId: "PostReservations"
 * summary: "Create a Reservation"
 * description: "Create a Reservation which can be associated with any resource, such as an order's line item."
 * x-authenticated: true
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        $ref: "#/components/schemas/AdminPostReservationsReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.reservations.create({
 *         line_item_id: "item_123",
 *         location_id: "loc_123",
 *         inventory_item_id: "iitem_123",
 *         quantity: 1
 *       })
 *       .then(({ reservation }) => {
 *         console.log(reservation.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/reservations' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "line_item_id": "item_123",
 *           "location_id": "loc_123",
 *           "inventory_item_id": "iitem_123",
 *           "quantity": 1
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Reservations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReservationsRes"
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
  const { validatedBody } = req as { validatedBody: AdminPostReservationsReq }

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const userId: string = req.user.id || req.user.userId

  if (isDefined(validatedBody.line_item_id)) {
    await validateUpdateReservationQuantity(
      validatedBody.line_item_id,
      validatedBody.quantity,
      {
        lineItemService: req.scope.resolve("lineItemService"),
        inventoryService: req.scope.resolve("inventoryService"),
      }
    )
  }

  const reservation = await inventoryService.createReservationItem({
    ...validatedBody,
    created_by: userId,
  })

  res.status(200).json({ reservation })
}

/**
 * @schema AdminPostReservationsReq
 * type: object
 * required:
 *   - location_id
 *   - inventory_item_id
 *   - quantity
 * properties:
 *   line_item_id:
 *     description: "The ID of the line item of the reservation."
 *     type: string
 *   location_id:
 *     description: "The ID of the location of the reservation."
 *     type: string
 *   inventory_item_id:
 *     description: "The ID of the inventory item the reservation is associated with."
 *     type: string
 *   quantity:
 *     description: "The quantity to reserve."
 *     type: number
 *   description:
 *     description: "The reservation's description."
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class AdminPostReservationsReq {
  @IsString()
  @IsOptional()
  line_item_id?: string

  @IsString()
  location_id: string

  @IsString()
  inventory_item_id: string

  @IsNumber()
  quantity: number

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
