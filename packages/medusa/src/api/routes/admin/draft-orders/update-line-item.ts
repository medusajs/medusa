import { IsInt, IsObject, IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
} from "."
import { DraftOrder } from "../../../.."
import { LineItemUpdate } from "../../../../types/cart"
import { CartService, DraftOrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /draft-orders/{id}/line-items/{line_id}
 * operationId: "PostDraftOrdersDraftOrderLineItemsItem"
 * summary: "Update a Line Item for a Draft Order"
 * description: "Updates a Line Item for a Draft Order"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           unit_price:
 *             description: The potential custom price of the item.
 *             type: integer
 *           title:
 *             description: The potential custom title of the item.
 *             type: string
 *           quantity:
 *             description: The quantity of the Line Item.
 *             type: integer
 *           metadata:
 *             description: The optional key-value map with additional details about the Line Item.
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
  const { id, line_id } = req.params

  const validated = await validator(
    AdminPostDraftOrdersDraftOrderLineItemsItemReq,
    req.body
  )

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const draftOrder: DraftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id, {
        select: defaultAdminDraftOrdersFields,
        relations: ["cart", "cart.items"],
      })

    if (draftOrder.status === "completed") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are only allowed to update open draft orders"
      )
    }

    if (validated.quantity === 0) {
      await cartService
        .withTransaction(manager)
        .removeLineItem(draftOrder.cart.id, line_id)
    } else {
      const existing = draftOrder.cart.items.find((i) => i.id === line_id)

      if (!existing) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Could not find the line item"
        )
      }

      const lineItemUpdate: LineItemUpdate = {
        ...validated,
        region_id: draftOrder.cart.region_id,
      }

      if (existing.variant_id) {
        lineItemUpdate.variant_id = existing.variant_id
      }

      await cartService
        .withTransaction(manager)
        .updateLineItem(draftOrder.cart_id, line_id, lineItemUpdate)
    }

    draftOrder.cart = await cartService
      .withTransaction(manager)
      .retrieve(draftOrder.cart_id, {
        relations: defaultAdminDraftOrdersCartRelations,
        select: defaultAdminDraftOrdersCartFields,
      })

    res.status(200).json({ draft_order: draftOrder })
  })
}

export class AdminPostDraftOrdersDraftOrderLineItemsItemReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsInt()
  @IsOptional()
  unit_price?: number

  @IsInt()
  @IsOptional()
  quantity?: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> = {}
}
