import { ClaimService, OrderService } from "../../../../services"
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /order/{id}/claims/{claim_id}
 * operationId: "PostOrdersOrderClaimsClaim"
 * summary: "Update a Claim"
 * description: "Updates a Claim."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (path) claim_id=* {string} The ID of the Claim.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           claim_items:
 *             description: The Claim Items that the Claim will consist of.
 *             type: array
 *             items:
 *               required:
 *                 - id
 *                 - images
 *                 - tags
 *               properties:
 *                 id:
 *                   description: The ID of the Claim Item.
 *                   type: string
 *                 item_id:
 *                   description: The ID of the Line Item that will be claimed.
 *                   type: string
 *                 quantity:
 *                   description: The number of items that will be returned
 *                   type: integer
 *                 note:
 *                   description: Short text describing the Claim Item in further detail.
 *                   type: string
 *                 reason:
 *                   description: The reason for the Claim
 *                   type: string
 *                   enum:
 *                     - missing_item
 *                     - wrong_item
 *                     - production_failure
 *                     - other
 *                 tags:
 *                   description: A list o tags to add to the Claim Item
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Tag ID
 *                       value:
 *                         type: string
 *                         description: Tag value
 *                 images:
 *                   description: A list of image URL's that will be associated with the Claim
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Image ID
 *                       url:
 *                         type: string
 *                         description: Image URL
 *                 metadata:
 *                   description: An optional set of key-value pairs to hold additional information.
 *                   type: object
 *           shipping_methods:
 *             description: The Shipping Methods to send the additional Line Items with.
 *             type: array
 *             items:
 *                properties:
 *                  id:
 *                    description: The ID of an existing Shipping Method
 *                    type: string
 *                  option_id:
 *                    description: The ID of the Shipping Option to create a Shipping Method from
 *                    type: string
 *                  price:
 *                    description: The price to charge for the Shipping Method
 *                    type: integer
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.updateClaim(order_id, claim_id, {
 *         no_notification: true
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/claims/{claim_id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "no_notification": true
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Claim
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/Order"
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
  const { id, claim_id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderClaimsClaimReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const claimService: ClaimService = req.scope.resolve("claimService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await claimService
      .withTransaction(transactionManager)
      .update(claim_id, validated)
  })

  const data = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order: data })
}

export class AdminPostOrdersOrderClaimsClaimReq {
  @IsArray()
  @IsOptional()
  @Type(() => Item)
  @ValidateNested({ each: true })
  claim_items?: Item[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_methods?: ShippingMethod[]

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

class ShippingMethod {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  option_id?: string

  @IsInt()
  @IsOptional()
  price?: number
}

class Item {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  note?: string

  @IsString()
  @IsOptional()
  reason?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags: Tag[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

class Image {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  url?: string
}

class Tag {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  value?: string
}
