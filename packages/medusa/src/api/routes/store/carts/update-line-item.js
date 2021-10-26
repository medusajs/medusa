import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /carts/{id}/line-items/{line_id}
 * operationId: PostCartsCartLineItemsItem
 * summary: Update a Line Item
 * description: "Updates a Line Item if the desired quantity can be fulfilled."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) line_id=* {string} The id of the Line Item.
 *   - (body) quantity=* {integer} The quantity to set the Line Item to.
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
  const { id, line_id } = req.params

  const schema = Validator.object().keys({
    quantity: Validator.number().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const manager = req.scope.resolve("manager")
  const cartService = req.scope.resolve("cartService")

  await manager.transaction(async (m) => {
    // If the quantity is 0 that is effectively deletion
    if (value.quantity === 0) {
      await cartService.withTransaction(m).removeLineItem(id, line_id)
    } else {
      const cart = await cartService.retrieve(id, { relations: ["items"] })

      const existing = cart.items.find((i) => i.id === line_id)
      if (!existing) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Could not find the line item"
        )
      }

      const lineItemUpdate = {
        variant_id: existing.variant.id,
        region_id: cart.region_id,
        quantity: value.quantity,
        metadata: existing.metadata || {},
      }

      await cartService
        .withTransaction(m)
        .updateLineItem(id, line_id, lineItemUpdate)
    }

    // If the cart has payment sessions update these
    const updated = await cartService.withTransaction(m).retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await cartService.withTransaction(m).setPaymentSessions(id)
    }
  })

  const cart = await cartService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })
  res.status(200).json({ cart })
}
