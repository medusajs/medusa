import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import { DraftOrder } from "../../../.."
import { CartService, DraftOrderService } from "../../../../services"
import { AddressPayload } from "../../../../types/common"
import { DraftOrderCreateProps } from "../../../../types/draft-orders"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /draft-orders
 * operationId: "PostDraftOrders"
 * summary: "Create a Draft Order"
 * description: "Creates a Draft Order"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDraftOrdersReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.create({
 *         email: 'user@example.com',
 *         region_id,
 *         items: [
 *           {
 *             quantity: 1
 *           }
 *         ],
 *         shipping_methods: [
 *           {
 *             option_id
 *           }
 *         ],
 *       })
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/draft-orders' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "region_id": "{region_id}"
 *           "items": [
 *              {
 *                "quantity": 1
 *              }
 *           ],
 *           "shipping_methods": [
 *              {
 *                "option_id": "{option_id}"
 *              }
 *           ]
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
 *           $ref: "#/components/schemas/AdminDraftOrdersRes"
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
  const validated = await validator(AdminPostDraftOrdersReq, req.body)

  const { shipping_address, billing_address, ...rest } = validated

  const draftOrderDataToCreate: DraftOrderCreateProps = { ...rest }

  if (typeof shipping_address === "string") {
    draftOrderDataToCreate.shipping_address_id = shipping_address
  } else {
    draftOrderDataToCreate.shipping_address = shipping_address
  }

  if (typeof billing_address === "string") {
    draftOrderDataToCreate.billing_address_id = billing_address
  } else {
    draftOrderDataToCreate.billing_address = billing_address
  }

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")

  const manager: EntityManager = req.scope.resolve("manager")
  let draftOrder: DraftOrder = await manager.transaction(
    async (transactionManager) => {
      return await draftOrderService
        .withTransaction(transactionManager)
        .create(draftOrderDataToCreate)
    }
  )

  draftOrder = await draftOrderService.retrieve(draftOrder.id, {
    relations: defaultAdminDraftOrdersRelations,
    select: defaultAdminDraftOrdersFields,
  })

  const cartService: CartService = req.scope.resolve("cartService")

  draftOrder.cart = await cartService
    .withTransaction(manager)
    .retrieveWithTotals(draftOrder.cart_id, {
      relations: defaultAdminDraftOrdersCartRelations,
      select: defaultAdminDraftOrdersCartFields,
    })

  res.status(200).json({ draft_order: cleanResponseData(draftOrder, []) })
}

enum Status {
  open = "open",
  completed = "completed",
}

/**
 * @schema AdminPostDraftOrdersReq
 * type: object
 * required:
 *   - email
 *   - region_id
 *   - shipping_methods
 * properties:
 *   status:
 *     description: "The status of the draft order"
 *     type: string
 *     enum: [open, completed]
 *   email:
 *     description: "The email of the customer of the draft order"
 *     type: string
 *     format: email
 *   billing_address:
 *     description: "The Address to be used for billing purposes."
 *     anyOf:
 *       - $ref: "#/components/schemas/AddressFields"
 *       - type: string
 *   shipping_address:
 *     description: "The Address to be used for shipping."
 *     anyOf:
 *       - $ref: "#/components/schemas/AddressFields"
 *       - type: string
 *   items:
 *     description: The Line Items that have been received.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         variant_id:
 *           description: The ID of the Product Variant to generate the Line Item from.
 *           type: string
 *         unit_price:
 *           description: The potential custom price of the item.
 *           type: integer
 *         title:
 *           description: The potential custom title of the item.
 *           type: string
 *         quantity:
 *           description: The quantity of the Line Item.
 *           type: integer
 *         metadata:
 *           description: The optional key-value map with additional details about the Line Item.
 *           type: object
 *   region_id:
 *     description: The ID of the region for the draft order
 *     type: string
 *   discounts:
 *     description: The discounts to add on the draft order
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           description: The code of the discount to apply
 *           type: string
 *   customer_id:
 *     description: The ID of the customer to add on the draft order
 *     type: string
 *   no_notification_order:
 *     description: An optional flag passed to the resulting order to determine use of notifications.
 *     type: boolean
 *   shipping_methods:
 *     description: The shipping methods for the draft order
 *     type: array
 *     items:
 *       type: object
 *       required:
 *          - option_id
 *       properties:
 *         option_id:
 *           description: The ID of the shipping option in use
 *           type: string
 *         data:
 *           description: The optional additional data needed for the shipping method
 *           type: object
 *         price:
 *           description: The potential custom price of the shipping
 *           type: integer
 *   metadata:
 *     description: The optional key-value map with additional details about the Draft Order.
 *     type: object
 */
export class AdminPostDraftOrdersReq {
  @IsEnum(Status)
  @IsOptional()
  status?: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsType([AddressPayload, String])
  billing_address?: AddressPayload | string

  @IsOptional()
  @IsType([AddressPayload, String])
  shipping_address?: AddressPayload | string

  @IsArray()
  @Type(() => Item)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsOptional()
  items?: Item[]

  @IsString()
  region_id: string

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

  @IsArray()
  @Type(() => ShippingMethod)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  shipping_methods: ShippingMethod[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}

class ShippingMethod {
  @IsString()
  option_id: string

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown> = {}

  @IsNumber()
  @IsOptional()
  price?: number
}

class Discount {
  @IsString()
  code: string
}

class Item {
  @IsString()
  @IsOptional()
  title?: string

  @IsNumber()
  @IsOptional()
  unit_price?: number

  @IsString()
  @IsOptional()
  variant_id?: string

  @IsNumber()
  quantity: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}
