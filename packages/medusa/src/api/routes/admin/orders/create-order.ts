import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { AddressPayload } from "../../../../types/common"
import { OrderService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders
 * operationId: "PostOrders"
 * summary: "Create an order"
 * description: "Creates and order"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - billing_address
 *           - shipping_address
 *           - items
 *           - region
 *           - customer_id
 *           - payment_method
 *           - shipping_method
 *         properties:
 *           status:
 *             description: status of the order
 *             type: string
 *             enum: [pending, completed, archived, canceled, requires_action]
 *           email:
 *             description: the email for the order
 *             type: string
 *             format: email
 *           billing_address:
 *             description: Billing address
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: Shipping address
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           items:
 *             description: The Line Items for the order
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/line_item"
 *           region:
 *             description: ID of Region where the order belongs
 *             type: string
 *           discounts:
 *             description: Discounts applied to the order
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/discount"
 *           customer_id:
 *             description: ID of the customer
 *             type: string
 *           payment_method:
 *             description: payment method chosen for the order
 *             type: object
 *             required:
 *               - provider_id
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: ID of the payment provider
 *               data:
 *                 description: Data relevant for the given payment method
 *                 type: object
 *           shipping_method:
 *             description: The Shipping Method used for shipping the order.
 *             type: object
 *             required:
 *               - provider_id
 *               - profile_id
 *               - price
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: The ID of the shipping provider.
 *               profile_id:
 *                 type: string
 *                 description: The ID of the shipping profile.
 *               price:
 *                 type: integer
 *                 description: The price of the shipping.
 *               data:
 *                 type: object
 *                 description: Data relevant to the specific shipping method.
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/line_item"
 *                 description: Items to ship
 *           no_notification:
 *             description: A flag to indicate if no notifications should be emitted related to the updated order.
 *             type: boolean
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */

export default async (req, res) => {
  const validated = await validator(AdminPostOrdersReq, req.body)

  const orderService: OrderService = req.scope.resolve("orderService")
  let order = await orderService.create(validated)
  order = await orderService.decorate(order, [], ["region"])

  res.status(200).json({ order })
}

export class AdminPostOrdersReq {
  @IsString()
  @IsOptional()
  status?: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressPayload)
  billing_address: AddressPayload

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressPayload)
  shipping_address: AddressPayload

  @IsArray()
  @IsNotEmpty()
  items: object[]

  @IsString()
  @IsNotEmpty()
  region: string

  @IsArray()
  @IsOptional()
  discounts?: object[]

  @IsString()
  @IsNotEmpty()
  customer_id: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method: PaymentMethod

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_method?: ShippingMethod[]

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

class PaymentMethod {
  @IsString()
  @IsNotEmpty()
  provider_id: string

  @IsObject()
  @IsOptional()
  data?: object
}

class ShippingMethod {
  @IsString()
  @IsNotEmpty()
  provider_id: string

  @IsString()
  @IsNotEmpty()
  profile_id: string

  @IsInt()
  @IsNotEmpty()
  price: number

  @IsObject()
  @IsOptional()
  data?: object

  @IsArray()
  @IsOptional()
  items?: object[]
}
