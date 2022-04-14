import { IsInt, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService, LineItemService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/line-items
 * operationId: PostCartsCartLineItems
 * summary: "Add a Line Item"
 * description: "Generates a Line Item with a given Product Variant and adds it
 *   to the Cart"
 * parameters:
 *   - (path) id=* {string} The id of the Cart to add the Line Item to.
 *   - (body) variant_id=* {string} The id of the Product Variant to generate the Line Item from.
 *   - (body) quantity=* {integer} The quantity of the Product Variant to add to the Line Item.
 *   - (body) metadata {object} An optional key-value map with additional details about the Line Item.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const customerId = req.user?.customer_id
  const validated = await validator(StorePostCartsCartLineItemsReq, req.body)

  const manager: EntityManager = req.scope.resolve("manager")
  const lineItemService: LineItemService = req.scope.resolve("lineItemService")
  const cartService: CartService = req.scope.resolve("cartService")

  await manager.transaction(async (m) => {
    const txCartService = cartService.withTransaction(m)
    const cart = await txCartService.retrieve(id)

    const line = await lineItemService
      .withTransaction(m)
      .generate(validated.variant_id, cart.region_id, validated.quantity, {
        customer_id: customerId || cart.customer_id,
        metadata: validated.metadata,
      })
    await txCartService.addLineItem(id, line)

    const updated = await txCartService.retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await txCartService.setPaymentSessions(id)
    }
  })

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}

export class StorePostCartsCartLineItemsReq {
  @IsString()
  variant_id: string

  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
