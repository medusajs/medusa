import { MedusaError } from "medusa-core-utils"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
} from "."
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { CartService, DraftOrderService } from "../../../../services"
import { Type } from "class-transformer"
import { AddressPayload } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /admin/draft-orders/{id}
 * operationId: PostDraftOrdersDraftOrder
 * summary: Update a Draft Order"
 * description: "Updates a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           region_id:
 *             type: string
 *             description: The id of the Region to create the Draft Order in.
 *           email:
 *             type: string
 *             description: "An email to be used on the Draft Order."
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           discounts:
 *             description: "An array of Discount codes to add to the Draft Order."
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: "The code that a Discount is identifed by."
 *                   type: string
 *           no_notification_order:
 *             description: "An optional flag passed to the resulting order to determine use of notifications."
 *             type: boolean
 *           customer_id:
 *             description: "The id of the Customer to associate the Draft Order with."
 *             type: string
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
  const { id } = req.params

  const validated = await validator(AdminPostDraftOrdersDraftOrderReq, req.body)

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")

  const draftOrder = await draftOrderService.retrieve(id)

  if (draftOrder.status === "completed") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You are only allowed to update open draft orders"
    )
  }

  if (validated.no_notification_order !== undefined) {
    await draftOrderService.update(draftOrder.id, {
      no_notification_order: validated.no_notification_order,
    })
    delete validated.no_notification_order
  }

  await cartService.update(draftOrder.cart_id, validated)

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
