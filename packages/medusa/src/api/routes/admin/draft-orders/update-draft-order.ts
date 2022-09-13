import { CartService, DraftOrderService } from "../../../../services"
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
} from "."

import { AddressPayload } from "../../../../types/common"
import { DraftOrderStatus } from "../../../../models"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/draft-orders/{id}
 * operationId: PostDraftOrdersDraftOrder
 * summary: Update a Draft Order
 * description: "Updates a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           region_id:
 *             type: string
 *             description: The ID of the Region to create the Draft Order in.
 *           country_code:
 *             type: string
 *             description: "The 2 character ISO code for the Country."
 *             externalDocs:
 *                url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *                description: See a list of codes.
 *           email:
 *             type: string
 *             description: "An email to be used on the Draft Order."
 *             format: email
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             $ref: "#/components/schemas/address"
 *           discounts:
 *             description: "An array of Discount codes to add to the Draft Order."
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - code
 *               properties:
 *                 code:
 *                   description: "The code that a Discount is identifed by."
 *                   type: string
 *           no_notification_order:
 *             description: "An optional flag passed to the resulting order to determine use of notifications."
 *             type: boolean
 *           customer_id:
 *             description: "The ID of the Customer to associate the Draft Order with."
 *             type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.update(draft_order_id, {
 *         email: "user@example.com"
 *       })
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
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
  const { id } = req.params

  const validated = await validator(AdminPostDraftOrdersDraftOrderReq, req.body)

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")

  const draftOrder = await draftOrderService.retrieve(id)

  if (draftOrder.status === DraftOrderStatus.COMPLETED) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You are only allowed to update open draft orders"
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    if (validated.no_notification_order !== undefined) {
      await draftOrderService
        .withTransaction(transactionManager)
        .update(draftOrder.id, {
          no_notification_order: validated.no_notification_order,
        })
      delete validated.no_notification_order
    }

    await cartService
      .withTransaction(transactionManager)
      .update(draftOrder.cart_id, validated)
  })

  draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
    relations: defaultAdminDraftOrdersCartRelations,
    select: defaultAdminDraftOrdersCartFields,
  })

  res.status(200).json({ draft_order: draftOrder })
}

export class AdminPostDraftOrdersDraftOrderReq {
  @IsString()
  @IsOptional()
  region_id?: string

  @IsString()
  @IsOptional()
  country_code?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  @Type(() => AddressPayload)
  billing_address?: AddressPayload

  @IsOptional()
  @Type(() => AddressPayload)
  shipping_address?: AddressPayload

  @IsArray()
  @IsOptional()
  @Type(() => Discount)
  @ValidateNested({ each: true })
  discounts?: Discount[]

  @IsString()
  @IsOptional()
  customer_id?: string

  @IsBoolean()
  @IsOptional()
  no_notification_order?: boolean
}

class Discount {
  @IsString()
  code: string
}
