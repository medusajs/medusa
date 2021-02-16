import { MedusaError, Validator } from "medusa-core-utils"
import { defaultCartFields, defaultCartRelations, defaultFields } from "."

export default async (req, res) => {
  const { id, line_id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const draftOrder = await draftOrderService
        .withTransaction(manager)
        .retrieve(id, { select: defaultFields })

      if (
        draftOrder.status === "completed" ||
        draftOrder.status === "awaiting"
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You are only allowed to update open draft orders"
        )
      }

      await cartService
        .withTransaction(manager)
        .removeLineItem(draftOrder.cart_id, line_id)

      draftOrder.cart = await cartService
        .withTransaction(manager)
        .retrieve(draftOrder.cart_id, {
          relations: defaultCartRelations,
          select: defaultCartFields,
        })

      res.status(200).json({ draft_order: draftOrder })
    })
  } catch (err) {
    throw err
  }
}
