import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."
import { OrderService } from "../../../../services"
import { AddressPayload } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders/{id}
 * operationId: "PostOrdersOrder"
 * summary: "Update an order"
 * description: "Updates and order"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           email:
 *             description: the email for the order
 *             type: string
 *           billing_address:
 *             description: Billing address
 *             anyOf:
 *               - $ref: "#/components/schemas/address
 *           shipping_address:
 *             description: Shipping address
 *             anyOf:
 *               - $ref: "#/components/schemas/address
 *           items:
 *             description: The Line Items for the order
 *             type: array
 *           region:
 *             description: Region where the order belongs
 *             type: string
 *           discounts:
 *             description: Discounts applied to the order
 *             type: array
 *           customer_id:
 *             description: id of the customer
 *             type: string
 *           payment_method:
 *             description:
 *             type: object
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: id of the payment provider
 *               data:
 *                 description: Data relevant for the given payment method
 *                 type: object
 *           shipping_method:
 *             description: The Shipping Method used for shipping the order.
 *             type: object
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: The id of the shipping provider.
 *               profile_id:
 *                 type: string
 *                 description: The id of the shipping profile.
 *               price:
 *                 type: integer
 *                 description: The price of the shipping.
 *               data:
 *                 type: object
 *                 description: Data relevant to the specific shipping method.
 *               items:
 *                 type: array
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
  const { id } = req.params

  const value = await validator(AdminPostOrdersOrderReq, req.body)

  const orderService: OrderService = req.scope.resolve("orderService")

  await orderService.update(id, value)

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

export class AdminPostOrdersOrderReq {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPayload)
  billing_address?: AddressPayload

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPayload)
  shipping_address?: AddressPayload

  @IsArray()
  @IsOptional()
  items?: object[]

  @IsString()
  @IsOptional()
  region?: string

  @IsArray()
  @IsOptional()
  discounts?: object[]

  @IsString()
  @IsOptional()
  customer_id?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method?: PaymentMethod

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_method?: ShippingMethod[]

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

class PaymentMethod {
  @IsString()
  @IsOptional()
  provider_id?: string

  @IsObject()
  @IsOptional()
  data?: object
}

class ShippingMethod {
  @IsString()
  @IsOptional()
  provider_id?: string

  @IsString()
  @IsOptional()
  profile_id?: string

  @IsInt()
  @IsOptional()
  price?: number

  @IsObject()
  @IsOptional()
  data?: object

  @IsArray()
  @IsOptional()
  items?: object[]
}
