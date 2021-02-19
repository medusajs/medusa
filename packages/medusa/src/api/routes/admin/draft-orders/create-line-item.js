import { MedusaError, Validator } from "medusa-core-utils"
import { defaultCartFields, defaultCartRelations, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    unit_price: Validator.number().optional(),
    variant_id: Validator.string().optional(),
    quantity: Validator.number().required(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")
    const lineItemService = req.scope.resolve("lineItemService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const draftOrder = await draftOrderService
        .withTransaction(manager)
        .retrieve(id, { select: defaultFields, relations: ["cart"] })

      if (
        draftOrder.status === "completed" ||
        draftOrder.status === "awaiting"
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You are only allowed to update open draft orders"
        )
      }

      if (value.variant_id) {
        const line = await lineItemService.generate(
          value.variant_id,
          draftOrder.cart.region_id,
          value.quantity,
          value.metadata,
          value.unit_price
        )

        await cartService
          .withTransaction(manager)
          .addLineItem(draftOrder.cart_id, line)
      } else {
        // custom line items can be added to a draft order
        await lineItemService.withTransaction(manager).create({
          cart_id: draftOrder.cart_id,
          has_shipping: true,
          title: value.title || "Custom item",
          allow_discounts: false,
          unit_price: value.unit_price || 0,
          quantity: value.quantity,
        })
      }

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
