import { MedusaError, Validator } from "medusa-core-utils"
import { defaultCartFields, defaultCartRelations, defaultFields } from "."

/**
 * @oas [post] /draft-orders/{id}/line-items/{line_id}
 * operationId: "PostDraftOrdersDraftOrderLineItemsItem"
 * summary: "Update a Line Item for a Draft Order"
 * description: "Updates a Line Item for a Draft Order"
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

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    unit_price: Validator.number().optional(),
    quantity: Validator.number().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const draftOrderService = req.scope.resolve("draftOrderService")
  const cartService = req.scope.resolve("cartService")
  const entityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const draftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id, {
        select: defaultFields,
        relations: ["cart", "cart.items"],
      })

    if (draftOrder.status === "completed") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are only allowed to update open draft orders"
      )
    }

    if (value.quantity === 0) {
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

      const lineItemUpdate = {
        ...value,
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
        relations: defaultCartRelations,
        select: defaultCartFields,
      })

    res.status(200).json({ draft_order: draftOrder })
  })
}
