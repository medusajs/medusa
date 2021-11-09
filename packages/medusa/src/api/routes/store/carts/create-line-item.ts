import { validator } from "../../../../utils/validator"
import { defaultFields, defaultRelations } from "."
import CartService from "../../../../services/cart"

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

  const validated = await validator(StoreCreateLineItem, req.body)

  const manager = req.scope.resolve("manager")
  const lineItemService = req.scope.resolve("lineItemService")
  const cartService = req.scope.resolve("cartService") as CartService

  await manager.transaction(async (m) => {
    const txCartService = cartService.withTransaction(m)
    const cart = await txCartService.retrieve(id)

    const line = await lineItemService
      .withTransaction(m)
      .generate(validated.variant_id, cart.region_id, validated.quantity, {
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
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ cart })
}

export class StoreCreateLineItem {
  variant_id: string
  quantity: number
  metadata?: object
}
