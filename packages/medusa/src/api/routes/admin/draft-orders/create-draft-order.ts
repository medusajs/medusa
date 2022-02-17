import { Type } from "class-transformer"
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
import { transformIdableFields } from "medusa-core-utils"
import {
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."
import { DraftOrder } from "../../../.."
import { DraftOrderService } from "../../../../services"
import { AddressPayload } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
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
 *         required:
 *           - email
 *           - items
 *           - region_id
 *           - shipping_methods
 *         properties:
 *           status:
 *             description: "The status of the draft order"
 *             type: string
 *           email:
 *             description: "The email of the customer of the draft order"
 *             type: string
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           items:
 *             description: The Line Items that have been received.
 *             type: array
 *             items:
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to generate the Line Item from.
 *                   type: string
 *                 unit_price:
 *                   description: The potential custom price of the item.
 *                   type: integer
 *                 title:
 *                   description: The potential custom title of the item.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *                 metadata:
 *                   description: The optional key-value map with additional details about the Line Item.
 *                   type: object
 *           region_id:
 *             description: The id of the region for the draft order
 *             type: string
 *           discounts:
 *             description: The discounts to add on the draft order
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: The code of the discount to apply
 *                   type: string
 *           customer_id:
 *             description: The id of the customer to add on the draft order
 *             type: string
 *           no_notification_order:
 *             description: An optional flag passed to the resulting order to determine use of notifications.
 *             type: boolean
 *           shipping_methods:
 *             description: The shipping methods for the draft order
 *             type: array
 *             items:
 *               properties:
 *                 option_id:
 *                   description: The id of the shipping option in use
 *                   type: string
 *                 data:
 *                   description: The optional additional data needed for the shipping method
 *                   type: object
 *                 price:
 *                   description: The potential custom price of the shipping
 *                   type: integer
 *           metadata:
 *             description: The optional key-value map with additional details about the Draft Order.
 *             type: object
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
 */

export default async (req, res) => {
  const validated = await validator(AdminPostDraftOrdersReq, req.body)

  const value = transformIdableFields(validated, [
    "shipping_address",
    "billing_address",
  ])

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  let draftOrder: DraftOrder = await draftOrderService.create(value)

  draftOrder = await draftOrderService.retrieve(draftOrder.id, {
    relations: defaultAdminDraftOrdersRelations,
    select: defaultAdminDraftOrdersFields,
  })

  res.status(200).json({ draft_order: draftOrder })
}

enum Status {
  open = "open",
  completed = "completed",
}

export class AdminPostDraftOrdersReq {
  @IsEnum(Status)
  @IsOptional()
  status?: string

  @IsEmail()
  email: string

  @IsOptional()
  @Type(() => AddressPayload)
  billing_address?: AddressPayload

  @IsOptional()
  @Type(() => AddressPayload)
  shipping_address?: AddressPayload

  @IsArray()
  @Type(() => Item)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  items: Item[]

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
  metadata?: Record<string, any> = {}
}

class ShippingMethod {
  @IsString()
  option_id: string

  @IsObject()
  @IsOptional()
  data?: Record<string, any> = {}

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
  metadata?: Record<string, any> = {}
}
